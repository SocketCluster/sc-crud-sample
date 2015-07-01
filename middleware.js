module.exports.attach = function (scServer) {
  // Setup SocketCluster middleware for access control
  
  scServer.addMiddleware(scServer.MIDDLEWARE_EMIT, function (socket, event, data, next) {
    if (event == 'get' || event == 'set') {
      if (socket.getAuthToken()) {
        next();
      } else {
        next('Cannot ' + event + ' data without being logged in - Params: ' + JSON.stringify(data));
        socket.emit('logout');
      }
    } else {
      next();
    }
  });
  
  scServer.addMiddleware(scServer.MIDDLEWARE_PUBLISH_IN, function (socket, channel, data, next) {
    if (socket.getAuthToken()) {
      next();
    } else {
      next('Cannot publish to ' + channel + ' channel without being logged in - Params: ' + JSON.stringify(data));
      socket.emit('logout');
    }
  });
  
  scServer.addMiddleware(scServer.MIDDLEWARE_SUBSCRIBE, function (socket, channel, next) {
    if (socket.getAuthToken()) {
      next();
    } else {
      next('Cannot subscribe to ' + channel + ' channel without being logged in');
      socket.emit('logout');
    }
  });
};