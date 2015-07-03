module.exports.attach = function (server, socket) {
  socket.on('get', function (query, callback) {
    var deepKey = [query.type];
    if (query.id) {
      deepKey.push(query.id);
      
      if (query.field) {
        deepKey.push(query.field);
      }
    }
    server.global.get(deepKey, function (err, data) {
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
    // TODO: Allow saving whole objects or an entire collection
    var deepKey = [query.type, query.id];
    if (query.field) {
      deepKey.push(query.field);
    }
    server.global.set(deepKey, query.value, function (err) {
      if (!err) {
        var channelName;
        if (query.field) {
          var publishPacket = {
            value: query.value
          };
          server.global.publish(query.type + '/' + query.id + '/' + query.field, publishPacket);
        }
      }
      callback(err);
    });
  });
};