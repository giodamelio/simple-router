const http = require('http');

const Router = function() {
  this.routes = {};

  // Add keys for all supported http methods
  http.METHODS.forEach((method) => {
    this.routes[method] = {};
  });
};

// Add router method for each type of method
http.METHODS.forEach((method) => {
  Router.prototype[method.toLowerCase()] = function(path, callback) {
    this.routes[method][path] = callback;
  };
});

Router.prototype.route = function() {
  return (req, res) => {
    const route = this.routes[req.method][req.url];
    if (typeof route === 'function') {
      route(req, res);
    }
  };
};

module.exports = Router;
