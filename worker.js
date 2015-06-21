var fs = require('fs');
var express = require('express');
var serveStatic = require('serve-static');
var path = require('path');

module.exports.run = function (worker) {
  console.log('   >> Worker PID:', process.pid);
  
  var app = require('express')();
  
  var httpServer = worker.httpServer;
  var scServer = worker.scServer;
  
  app.use(serveStatic(path.resolve(__dirname, 'public')));

  httpServer.on('request', app);
  
  scServer.addMiddleware(scServer.MIDDLEWARE_PUBLISH_OUT,
    function (socket, channel, data, next) {
      if (data.from == socket.id) {
        // Prevent publishing back to publisher for efficiency reasons
        next(true);
      } else {
        next();
      }
    }
  );

  var count = 0;
  
  var products = {
    1: {
      id: 1,
      name: 'Google NEXUS 6 32GB',
      qty: 6,
      price: 649.95,
      desc: 'A smartphone by Google'
    }
  };
  
  scServer.global.set('Product', products);

  /*
    In here we handle our incoming realtime connections and listen for events.
  */
  scServer.on('connection', function (socket) {
  
    socket.on('get', function (query, callback) {
      var deepKey = [query.type, query.id];
      if (query.field) {
        deepKey.push(query.field);
      }
      scServer.global.get(deepKey, callback);
    });
    
    socket.on('set', function (query, callback) {
      var deepKey = [query.type, query.id];
      if (query.field) {
        deepKey.push(query.field);
      }
      scServer.global.set(deepKey, query.value, function (err) {
        if (!err) {
          var channelName;
          if (query.field) {
            var publishPacket = {
              from: socket.id,
              value: query.value
            };
            scServer.global.publish(query.type + '/' + query.id + '/' + query.field, publishPacket);
          }
        }
        callback(err);
      });
    });
  });
};