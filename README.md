# Simple router

A super simple router for Node HTTP servers.

## Example

```javascript
const http = require('http');
const SimpleRouter = require('simple-router');

const router = new SimpleRouter();
router.get('/', function(req, res) {
  res.status(200);
  res.header('Content-Type', 'text/plain');
  res.end('Hello World');
});

http.createServer(router.route()).listen(2002);
```

# Documentation

## Method routes
Supported methods: everything in `require('http').METHODS`

Take one or more callbacks with the parameters `req` and `res`. `req` is a [vanilla node request](https://nodejs.org/api/http.html#http_class_http_incomingmessage). The `res` object is an instance of the Response class(see below). The original response object can be found at `res._res`.

### Example

```javascript
router.post(function(req, res) {
  res.json({
    hello: 'world!'
  });
});
```

## Response class

### .status(code)

Sets the status code of the response

### .header(name, value)

Sets a header on the response

### .write(data)

Writes some data to the response. Works the same as [`http.ServerResponse.write`](https://nodejs.org/api/http.html#http_response_write_chunk_encoding_callback)


### .end(data)

Ends the response. Works the same as [`http.ServerResponse.end`](https://nodejs.org/api/http.html#http_response_end_data_encoding_callback)

### .json(object)

Makes it easy to send a json response. Converts object to JSON and sets status 200 and proper `Content-Type`
