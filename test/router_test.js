const http = require('http');

const expect = require('chai').expect;
const supertest = require('supertest');

const Router = require('../');

describe('Router', () => {
  it('Creates a router', () => {
    const router = new Router();
    expect(router).to.be.an.instanceof(Router);
  });

  it('Creates simple route', (done) => {
    const router = new Router();

    router.get('/', (req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Hello World!');
    });

    supertest(http.createServer(router.route()))
      .get('/')
      .expect(200)
      .expect('Content-Type', 'text/plain')
      .end(done);
  });
});
