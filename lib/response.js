const Response = function(res) {
  this._res = res;

  this._status = 200;
  this._headers = {};
  this._hasWrittenHead = false;
};

// Set our response status
Response.prototype.status = function(status) {
  this._status = status;
};

// Set a response header
Response.prototype.header = function(key, value) {
  this._headers[key] = value;
};

// Write some data to our body
Response.prototype.write = function(data) {
  if (!this._hasWrittenHead) this.writeHead();
  this._res.write(data);
};

// End the response, optionally writing some data
Response.prototype.end = function(data) {
  if (!this._hasWrittenHead) this.writeHead();
  this._res.end(data);
};

// Respond with json
Response.prototype.json = function(json) {
  this._res.writeHead(200, { 'Content-Type': 'application/json' });
  this._res.end(JSON.stringify(json));
};

// Write the head
Response.prototype.writeHead = function() {
  this._hasWrittenHead = true;
  this._res.writeHead(this._status, this._headers);
};

module.exports = Response;
