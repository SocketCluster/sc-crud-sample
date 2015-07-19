module.exports.attach = function (scServer) {
  /*
    Note that we are using SC's default in-memory data store (scServer.global) for simplicity 
    but in a real scenario, you should use a proper database to store persistent data.
  */
  
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
  
  var users = {
    'bob': {
      password: 'password123'
    }
  };
  
  scServer.global.set('User', users);
};