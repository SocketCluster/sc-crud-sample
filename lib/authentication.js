module.exports.attach = function (socket) {
  var tokenExpiresInMinutes = 10;

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
};