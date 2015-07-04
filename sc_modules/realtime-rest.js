module.exports.attach = function (scServer, socket) {
  socket.on('get', function (query, callback) {
    var deepKey = [query.type];
    if (query.id) {
      deepKey.push(query.id);
      
      if (query.field) {
        deepKey.push(query.field);
      }
    }
    scServer.global.get(deepKey, function (err, data) {
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
    });
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
      return {id: nextId, list: DataMap.get(deepKey)};
    };
    queryFn.data = {
      deepKey: deepKey
    };
    
    scServer.global.run(queryFn, function (err, result) {
      if (!err) {
        var publishPacket = {
          value: result.list
        };
        scServer.global.publish(query.type + '/' + query.id + '/' + query.field, publishPacket);
      }
      callback(err, result.id);
    });
  });
};