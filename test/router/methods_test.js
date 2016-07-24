'use strict';
const http = require('http');

const expect = require('chai').expect;
const supertest = require('supertest-as-promised');

const Router = require('../../');

describe('Router - Test each method type', () => {
  // Don't test CONNECT method because it works a bit different then the rest
  http.METHODS.splice(http.METHODS.indexOf('CONNECT'), 1);

  for (let i = 0; i < http.METHODS.length; i++) {
    const method = http.METHODS[i];
    it(`Test ${method} method`, () => {
      const router = new Router();
      router[method.toLowerCase()]('/', (req, res) => {
        res.header('Content-Type', 'text/plain');
        res.status(200);
        res.write('Hello ');
        res.write('World');
        res.end('!');
      });

      return supertest(http.createServer(router.route()))[method.toLowerCase()]('/')
        .expect(200)
        .expect('Content-Type', 'text/plain')
        .then((res) => {
          if (res.req.method !== 'HEAD') {
            expect(res.text).to.equal('Hello World!');
          }
        });
    });
  }
});
