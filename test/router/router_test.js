'use strict';
const http = require('http');

const expect = require('chai').expect;
const supertest = require('supertest-as-promised');

const Router = require('../../');

describe('Router', () => {
  it('Creates a router', () => {
    const router = new Router();
    expect(router).to.be.an.instanceof(Router);
  });

  it('Handles errors', () => {
    const router = new Router();

    router.get('/', (req, res) => {
      res.header('Content-Type', 'text/plain');
      res.status(200);
      res.end('Hello World!');
    });

    return supertest(http.createServer(router.route()))
      .get('/haha')
      .expect('Content-Type', 'text/plain')
      .expect(404)
      .expect('404 not found');
  });

  it('Json helper', () => {
    const router = new Router();

    router.get('/', (req, res) => {
      res.json({
        hello: 'world!',
      });
    });

    return supertest(http.createServer(router.route()))
      .get('/')
      .expect('Content-Type', 'application/json')
      .expect(200)
      .expect({
        hello: 'world!',
      });
  });

  it('rootPath option', () => {
    const router = new Router({
      rootPath: '/api',
    });

    router.get('/hello', (req, res) => {
      res.json({
        hello: 'world!',
      });
    });

    return supertest(http.createServer(router.route()))
      .get('/api/hello')
      .expect('Content-Type', 'application/json')
      .expect(200)
      .expect({
        hello: 'world!',
      });
  });
});
