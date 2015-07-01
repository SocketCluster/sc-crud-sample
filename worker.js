var fs = require('fs');
var express = require('express');
var serveStatic = require('serve-static');
var path = require('path');
var dataStore = require('./data_store');
var middleware = require('./middleware');

module.exports.run = function (worker) {
  console.log('   >> Worker PID:', process.pid);
  
  var app = require('express')();
  
  var httpServer = worker.httpServer;
  var scServer = worker.scServer;
  
  app.use(serveStatic(path.resolve(__dirname, 'public')));

  httpServer.on('request', app);
  
  dataStore.attach(scServer);
  middleware.attach(scServer);

  var tokenExpiresInMinutes = 10;
  
  /*
    In here we handle our incoming realtime connections and listen for events.
  */
  scServer.on('connection', function (socket) {
    var tokenRenewalIntervalInMilliseconds = Math.round(1000 * 60 * tokenExpiresInMinutes / 3);
    
    // Keep renewing the token (if there is one) at a predefined interval to make sure that 
    // it doesn't expire while the connection is active.
    var renewAuthTokenInterval = setInterval(function () {
      var currentToken = socket.getAuthToken();
      if (currentToken) {
        socket.setAuthToken(currentToken, {expiresInMinutes: tokenExpiresInMinutes});
      }
    }, tokenRenewalIntervalInMilliseconds);
    
    socket.once('disconnect', function () {
      clearInterval(renewAuthTokenInterval);
    });
    
    var validateLoginDetails = function (details, callback) {
      if (details.username == 'bob' && details.password == '123') {
        socket.setAuthToken(details, {expiresInMinutes: tokenExpiresInMinutes});
        callback();
      } else {
        // This is not an error.
        // We are simply rejecting the login - So we will 
        // leave the first (error) argument as null.
        callback(null, 'Invalid username or password');
      }
    };
    
    socket.on('login', validateLoginDetails);
    
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
      // TODO: Allow saving whole objects or an entire collection
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