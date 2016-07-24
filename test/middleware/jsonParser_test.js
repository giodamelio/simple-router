'use strict';
const http = require('http');

const supertest = require('supertest-as-promised');

const Router = require('../../');

describe('Middleware - Json Parser', () => {
  it('Parse json', () => {
    const router = new Router();

    router.post('/', Router.jsonParser(), (req, res) => {
      res.status(200);
      res.header('Content-Type', 'application/json');
      res.write(JSON.stringify(req.body));
      res.end();
    });

    return supertest(http.createServer(router.route()))
      .post('/')
      .send({
        hello: 'world!',
      })
      .expect('Content-Type', 'application/json')
      .expect(200)
      .expect({
        hello: 'world!',
      });
  });

  it('Parse invalid json', () => {
    const router = new Router();

    router.post('/', Router.jsonParser(), (req, res) => {
      res.status(200);
      res.header('Content-Type', 'application/json');
      res.end(JSON.stringify(req.body));
    });

    return supertest(http.createServer(router.route()))
      .post('/')
      .send('I am not json')
      .expect('Content-Type', 'text/plain')
      .expect(500)
      .expect('500 Internal server error');
  });
});
