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
  Router.prototype[method.toLowerCase()] = function(path) {
    this.routes[method][path] = Array.prototype.slice.call(arguments, 1);
  };
});

Router.prototype.route = function() {
  return (req, res) => {
    const routes = this.routes[req.method][req.url];
    if (routes && routes.length > 0) {
      // Run the callbacks one after the other
      routes.reduce((previous, handler) => (
        previous.then(() => {
          const handlerValue = handler(req, res);
          if (handlerValue instanceof Promise) {
            return handlerValue;
          }
          return Promise.resolve(handlerValue);
        })
      ), Promise.resolve())
        .catch(() => {
          // TODO: handle error here
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('500 Internal server error');
        });
    } else {
      this.routerOptions.errorHandler(req, res);
    }
  };
};

// Add re-export some middleware
Router.jsonParser = require('./middleware/jsonParser');

module.exports = Router;
