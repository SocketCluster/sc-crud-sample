var fs = require('fs');
var express = require('express');
var serveStatic = require('serve-static');
var path = require('path');
var dummyData = require('./sc_modules/dummy-data');
var authentication = require('./sc_modules/authentication');
var scCrudRethink = require('sc-crud-rethink');

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

  var thinky = scCrudRethink.thinky;
  var type = thinky.type;

  var crudOptions = {
    defaultPageSize: 5,
    schema: {
      Category: {
        fields: {
          id: type.string(),
          name: type.string(),
          desc: type.string().optional()
        },
        views: {
          alphabeticalView: {
            transform: function (fullTableQuery, r) {
              return fullTableQuery.orderBy(r.asc('name'));
            }
          }
        },
        accessControl: mustBeLoggedIn
      },
      Product: {
        fields: {
          id: type.string(),
          name: type.string(),
          qty: type.number().integer().optional(),
          price: type.number().optional(),
          desc: type.string().optional(),
          category: type.string()
        },
        views: {
          categoryView: {
            transform: function (fullTableQuery, r, categoryId) {
              return fullTableQuery.filter(r.row('category').eq(categoryId)).orderBy(r.asc('qty'))
            }
          }
        },
        accessControl: mustBeLoggedIn
      },
      User: {
        fields: {
          username: type.string(),
          password: type.string()
        },
        accessControl: mustBeLoggedIn
      }
    },

    thinkyOptions: {
      host: '127.0.0.1',
      port: 28015
    }
  };

  function mustBeLoggedIn(req, next) {
    if (req.socket.getAuthToken()) {
      next();
    } else {
      next(true);
      req.socket.emit('logout');
    }
  }

  var crud = scCrudRethink.attach(worker, crudOptions);
  scServer.thinky = crud.thinky;

  // Add some dummy data to our store
  dummyData.attach(scServer, crud);

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
  });
};
