module.exports.attach = function (scServer, scCrudRethink) {
  /*
    Note that we are using SC's default in-memory data store (scServer.global) for simplicity
    but in a real scenario, you should use a proper database to store persistent data.
  */

  // TODO: Add data if it doesn't already exist

  // scCrudRethink.create({
  //   type: 'Category',
  //   value: {
  //     "desc":  "KKKKKK" ,
  //     "name":  "Smartphones2222"
  //   }
  // });

  // scCrudRethink.delete({
  //   type: 'Category',
  //   id: "cbb69ddc-7ea0-4738-af31-e8f42d635f9b"
  // });

  var rethinkAdd = false;

  // Hardcoded dummy data

  var schema = {
    Category: {
      foreignKeys: {
        products: 'Product'
      }
    }
  };

  scServer.global.set('Schema', schema);

  var categories = {
    1: {
      name: 'Smartphones',
      desc: 'Handheld mobile devices'
    },
    2: {
      name: 'Tablets',
      desc: 'Mobile tablet devices'
    },
    3: {
      name: 'Desktops',
      desc: 'Desktop computers'
    },
    4: {
      name: 'Laptops',
      desc: 'Laptops computers'
    }
  };

  scServer.global.set('Category', categories);

  if (rethinkAdd) {
    Object.keys(categories).forEach(function (id) {
      var obj = categories[id];
      scCrudRethink.create({
        type: 'Category',
        value: obj
      });
    });
  }

  // Hardcoded dummy data
  var products = {
    1: {
      name: 'Google NEXUS 6 32GB',
      qty: 6,
      price: 649.95,
      desc: 'A smartphone by Google',
      category: 'a'
    },
    2: {
      name: 'Apple iPhone 6',
      qty: 14,
      price: 999.00,
      desc: 'A smartphone by Apple',
      category: 'a'
    }
  };

  scServer.global.set('Product', products);

  if (rethinkAdd) {
    Object.keys(products).forEach(function (id) {
      var obj = products[id];
      scCrudRethink.create({
        type: 'Product',
        value: obj
      });
    });
  }

  var users = {
    'bob': {
      password: 'password123'
    }
  };

  scServer.global.set('User', users);

  if (rethinkAdd) {
    Object.keys(users).forEach(function (id) {
      var obj = users[id];
      scCrudRethink.create({
        type: 'User',
        value: obj
      });
    });
  }
};
