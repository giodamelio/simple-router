'use strict';
module.exports = function() {
  return (req) => new Promise((resolve, reject) => {
    let rawBody = '';
    req.on('data', (chunk) => {
      rawBody += chunk.toString();
    });
    req.on('end', () => {
      try {
        req.body = JSON.parse(rawBody);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  });
};
