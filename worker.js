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
  
  var c = 0;
  
  setInterval(function () {
    scServer.global.publish('Product/1/qty', c++);
  }, 1000);

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
            scServer.global.publish(query.type + '/' + query.id + '/' + query.field, query.value);
          }
        }
        callback(err);
      });
    });
    
  });
};