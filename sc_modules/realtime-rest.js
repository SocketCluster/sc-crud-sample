module.exports.attach = function (scServer, socket, options) {
  options = options || {};
  
  if (!options.pageSize) {
    options.pageSize = 10;
  }
  
  socket.on('get', function (query, callback) {
    var deepKey = [query.type];
    if (query.id) {
      deepKey.push(query.id);
      
      if (query.field) {
        deepKey.push(query.field);
      }
    }
    
    var dataHandler = function (err, data) {
      if (query.id) {
        callback(err, data);
      } else {
        var resultAsArray = [];
        for (var i in data) {
          if (data.hasOwnProperty(i)) {
            resultAsArray.push(data[i]);
          }
        }
        callback(err, resultAsArray);
      }
    };
    
    if (query.page == null) {
      scServer.global.get(deepKey, dataHandler);
    } else {
      var startIndex = query.page * options.pageSize;
      scServer.global.getRange(deepKey, startIndex, startIndex + options.pageSize, dataHandler);
    }
  });
  
  socket.on('set', function (query, callback) {
    var deepKey = [query.type, query.id];
    if (query.field) {
      deepKey.push(query.field);
    }
    scServer.global.set(deepKey, query.value, function (err) {
      if (!err) {
        if (query.field) {
          var publishPacket = {
            value: query.value
          };
          scServer.global.publish(query.type + '/' + query.id + '/' + query.field, publishPacket);
        }
      }
      callback(err);
    });
  });
  
  socket.on('add', function (query, callback) {
    var deepKey = [query.type, query.id, query.field];
    
    var queryFn = function (DataMap) {
      var foreignKey = DataMap.get(foreignKeyPath);
      if (foreignKey) {
        var collectionLength = DataMap.count(deepKey);
        var nextId = DataMap.count(foreignKey) + 1;
        
        DataMap.add(deepKey, nextId);
        
        var pageNumber = Math.floor(collectionLength / pageSize);
        var startIndex = pageNumber * pageSize;
        var endIndex = startIndex + pageSize;
        
        return {
          pageNumber: pageNumber,
          id: nextId,
          list: DataMap.getRange(deepKey, startIndex, endIndex)
        };
      } else {
        return {
          error: 'Invalid foreign key'
        };
      }
    };
  
    queryFn.data = {
      deepKey: deepKey,
      pageSize: options.pageSize,
      foreignKeyPath: ['Schema', query.type, 'foreignKeys', query.field]
    };
    
    scServer.global.run(queryFn, function (err, result) {
      if (result.error) {
        callback('Collection in field ' + query.field + ' of type ' + query.type + ' is not associated with a valid foreign key');
      } else {
        if (!err) {
          // TODO: Only send back the addition instead of the whole list
          var publishPacket = {
            value: result.list
          };
          
          scServer.global.publish(result.pageNumber + ':' + query.type + '/' + query.id + '/' + query.field, publishPacket);
        }
        callback(err, result.id);
      }
    });
  });
};