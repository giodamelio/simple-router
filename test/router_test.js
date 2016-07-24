'use strict';
const http = require('http');

const expect = require('chai').expect;
const supertest = require('supertest-as-promised');

const Router = require('../');

describe('Router', () => {
  it('Creates a router', () => {
    const router = new Router();
    expect(router).to.be.an.instanceof(Router);
  });

  it('Handles errors', () => {
    const router = new Router();

    router.get('/', (req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Hello World!');
    });

    return supertest(http.createServer(router.route()))
      .get('/haha')
      .expect('Content-Type', 'text/plain')
      .expect(404)
      .expect('404 not found');
  });

  describe('Chain multiple callbacks', () => {
    it('Multiple callbacks', () => {
      const router = new Router();

      router.get('/', (req, res) => {
        return new Promise((resolve) => {
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          setTimeout(() => {
            resolve();
          }, 1000);
        });
      }, (req, res) => {
        res.end('Hello World!');
      });

      return supertest(http.createServer(router.route()))
        .get('/')
        .expect('Content-Type', 'text/plain')
        .expect(200)
        .expect('Hello World!');
    });
  });

  describe('Test each method type', () => {
    // Don't test CONNECT method because it works a bit different then the rest
    http.METHODS.splice(http.METHODS.indexOf('CONNECT'), 1);

    for (let i = 0; i < http.METHODS.length; i++) {
      const method = http.METHODS[i];
      it(`Test ${method} method`, () => {
        const router = new Router();
        router[method.toLowerCase()]('/', (req, res) => {
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('Hello World!');
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
});
