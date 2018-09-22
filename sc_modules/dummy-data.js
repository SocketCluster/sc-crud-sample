module.exports.attach = function (scServer, scCrudRethink) {
  /*
    Add some dummy data to RethinkDB;
  */

  scCrudRethink.read({
    type: 'User'
  }, function (err, result) {
    if (err) {
      console.error(err);
      return;
    }
    // If there is no User data, assume that we are starting with
    // an empty database.
    if (!result.data.length) {
      var schema = {
        Category: {
          foreignKeys: {
            products: 'Product'
          }
        }
      };

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
          desc: 'Laptop computers'
        }
      };

      Object.keys(categories).forEach(function (id) {
        var obj = categories[id];
        scCrudRethink.create({
          type: 'Category',
          value: obj
        });
      });

      var users = {
        'alice': {
          username: 'alice',
          password: 'password123'
        }
      };

      Object.keys(users).forEach(function (id) {
        var obj = users[id];
        scCrudRethink.create({
          type: 'User',
          value: obj
        });
      });
    }
  });
};
