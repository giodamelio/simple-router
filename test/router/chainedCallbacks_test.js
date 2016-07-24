'use strict';
const http = require('http');

const supertest = require('supertest-as-promised');

const Router = require('../../');

describe('Router - Chain multiple callbacks', () => {
  it('Multiple callbacks', () => {
    const router = new Router();

    router.get('/', (req, res) => (
      new Promise((resolve) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        setTimeout(() => {
          resolve();
        }, 1000);
      })
    ), (req, res) => {
      res.end('Hello World!');
    });

    return supertest(http.createServer(router.route()))
      .get('/')
      .expect('Content-Type', 'text/plain')
      .expect(200)
      .expect('Hello World!');
  });
});
