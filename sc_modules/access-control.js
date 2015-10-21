module.exports.attach = function (scServer) {
  // Setup SocketCluster middleware for access control

  scServer.addMiddleware(scServer.MIDDLEWARE_EMIT, function (socket, event, data, next) {
    if (event == 'get' || event == 'set') {
      // If socket has a valid auth token, then allow emitting get or set events
      if (socket.getAuthToken()) {
        next();
      } else {
        next('Cannot ' + event + ' data without being logged in - Params: ' + JSON.stringify(data));
        socket.emit('logout');
      }
    } else {
      // Other events don't require the socket to be authenticated
      next();
    }
  });

  scServer.addMiddleware(scServer.MIDDLEWARE_PUBLISH_IN, function (socket, channel, data, next) {
    // If socket has a valid auth token, then allow publishing to any channel
    if (socket.getAuthToken()) {
      next();
    } else {
      next('Cannot publish to ' + channel + ' channel without being logged in - Params: ' + JSON.stringify(data));
      socket.emit('logout');
    }
  });

  scServer.addMiddleware(scServer.MIDDLEWARE_SUBSCRIBE, function (socket, channel, next) {
    // If socket has a valid auth token, then allow subscribing to any channel
    if (socket.getAuthToken()) {
      next();
    } else {
      next('Cannot subscribe to ' + channel + ' channel without being logged in');
      socket.emit('logout');
    }
  });
};
