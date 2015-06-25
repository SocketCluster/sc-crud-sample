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
  
  // Hardcoded dummy data
  var categories = {
    1: {
      id: 1,
      name: 'Smartphones',
      desc: 'Handheld mobile devices',
      products: [1, 2]
    },
    2: {
      id: 2,
      name: 'Tablets',
      desc: 'Mobile tablet devices'
    },
    3: {
      id: 3,
      name: 'Desktops',
      desc: 'Desktop computers'
    },
    4: {
      id: 4,
      name: 'Laptops',
      desc: 'Laptops computers'
    }
  };
  
  scServer.global.set('Category', categories);
  
  // Hardcoded dummy data
  var products = {
    1: {
      id: 1,
      name: 'Google NEXUS 6 32GB',
      qty: 6,
      price: 649.95,
      desc: 'A smartphone by Google'
    },
    2: {
      id: 2,
      name: 'Apple iPhone 6',
      qty: 14,
      price: 999.00,
      desc: 'A smartphone by Apple'
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