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
      var nextId = DataMap.count(deepKey) + 1;
      DataMap.add(deepKey, nextId);
      
      var pageNumber = Math.floor((nextId - 1) / pageSize);
      var startIndex = pageNumber * pageSize;
      var endIndex = startIndex + pageSize;
      
      return {
        pageNumber: pageNumber,
        id: nextId,
        list: DataMap.getRange(deepKey, startIndex, endIndex)
      };
    };
    
    queryFn.data = {
      deepKey: deepKey,
      pageSize: options.pageSize
    };
    
    scServer.global.run(queryFn, function (err, result) {
      if (!err) {
        // TODO: Only send back the addition instead of the whole list
        var publishPacket = {
          value: result.list
        };
        
        scServer.global.publish(result.pageNumber + ':' + query.type + '/' + query.id + '/' + query.field, publishPacket);
      }
      callback(err, result.id);
    });
  });
};