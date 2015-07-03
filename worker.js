var fs = require('fs');
var express = require('express');
var serveStatic = require('serve-static');
var path = require('path');
var dummyData = require('./lib/dummy-data');
var accessControl = require('./lib/access-control');
var authentication = require('./lib/authentication');
var realtimeRest = require('./lib/realtime-rest');

module.exports.run = function (worker) {
  console.log('   >> Worker PID:', process.pid);
  
  var httpServer = worker.httpServer;
  var scServer = worker.scServer;
  
  // Use ExpressJS to handle serving static HTTP files
  var app = require('express')();
  app.use(serveStatic(path.resolve(__dirname, 'public')));
  httpServer.on('request', app);
  
  // Add some dummy data to our store
  dummyData.attach(scServer);
  
  // Access control middleware
  accessControl.attach(scServer);
  
  /*
    In here we handle our incoming realtime connections and listen for events.
  */
  scServer.on('connection', function (socket) {
    // Authentication logic
    authentication.attach(socket);
    
    // Realtime rest layer to get, set and subscribe to data changes
    realtimeRest.attach(scServer, socket);
  });
};