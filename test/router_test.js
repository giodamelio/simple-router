const http = require('http');

const expect = require('chai').expect;
const supertest = require('supertest-as-promised');

const Router = require('../');

describe('Router', () => {
  it('Creates a router', () => {
    const router = new Router();
    expect(router).to.be.an.instanceof(Router);
  });

  describe('Test each method type', () => {
    // Don't test CONNECT method because it works a bit different then the rest
    http.METHODS.splice(http.METHODS.indexOf('CONNECT'), 1);
    for (const method of http.METHODS) {
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
