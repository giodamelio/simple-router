const http = require('http');

const _ = require('lodash');

const Router = function(options) {
  this.routerOptions = _.defaults(options || {}, {
    // Handle errors
    errorHandler(req, res) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 not found');
    },
  });

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
    } else {
      this.routerOptions.errorHandler(req, res);
    }
  };
};

module.exports = Router;
