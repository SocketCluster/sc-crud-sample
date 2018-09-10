module.exports.attach = function (scServer) {
  // Setup SocketCluster middleware for access control
  // TODO 2: Uncomment
  // scServer.addMiddleware(scServer.MIDDLEWARE_EMIT, function (req, next) {
  //   if (req.event == 'create' || req.event == 'read' || req.event == 'update' || req.event == 'delete') {
  //     // If socket has a valid auth token, then allow emitting CRUD events
  //     if (req.socket.getAuthToken()) {
  //       next();
  //     } else {
  //       next('Cannot ' + req.event + ' data without being logged in - Params: ' + JSON.stringify(req.data));
  //       req.socket.emit('logout');
  //     }
  //   } else {
  //     // Other events don't require the socket to be authenticated
  //     next();
  //   }
  // });
  //
  // scServer.addMiddleware(scServer.MIDDLEWARE_PUBLISH_IN, function (req, next) {
  //   // If socket has a valid auth token, then allow publishing to any channel
  //   if (req.socket.getAuthToken()) {
  //     next();
  //   } else {
  //     next('Cannot publish to ' + req.channel + ' channel without being logged in - Params: ' + JSON.stringify(req.data));
  //     req.socket.emit('logout');
  //   }
  // });
  //
  // scServer.addMiddleware(scServer.MIDDLEWARE_SUBSCRIBE, function (req, next) {
  //   // If socket has a valid auth token, then allow subscribing to any channel
  //   if (req.socket.getAuthToken()) {
  //     next();
  //   } else {
  //     next('Cannot subscribe to ' + req.channel + ' channel without being logged in');
  //     req.socket.emit('logout');
  //   }
  // });
};
