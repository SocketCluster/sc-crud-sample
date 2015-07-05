var fs = require('fs');
var express = require('express');
var serveStatic = require('serve-static');
var path = require('path');
var dummyData = require('./sc_modules/dummy-data');
var accessControl = require('./sc_modules/access-control');
var authentication = require('./sc_modules/authentication');
var realtimeRest = require('./sc_modules/realtime-rest');

module.exports.run = function (worker) {
  console.log('   >> Worker PID:', process.pid);
  
  var httpServer = worker.httpServer;
  var scServer = worker.scServer;
  
  // Use ExpressJS to handle serving static HTTP files
  var app = require('express')();
  app.use(serveStatic(path.resolve(__dirname, 'public')));
  httpServer.on('request', app);
  
  /*
    Here we attach some modules to scServer - Each module injects their own logic into the scServer to handle
    a specific aspect of the system/business logic.
  */
  
  // Add some dummy data to our store
  dummyData.attach(scServer);
  
  // Access control middleware
  accessControl.attach(scServer);
  
  /*
    In here we handle our incoming realtime connections and listen for events.
  */
  scServer.on('connection', function (socket) {
    /*
      Attach some modules to the socket object - Each one decorates the socket object with
      additional features or business logic.
    */
  
    // Authentication logic
    authentication.attach(scServer, socket);
    
    var restOptions = {
      pageSize: 5
    };
    
    // Realtime rest layer to get, set and subscribe to data changes
    realtimeRest.attach(scServer, socket, restOptions);
  });
};