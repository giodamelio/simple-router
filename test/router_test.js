const http = require('http');

const expect = require('chai').expect;

const Router = require('../');

describe('Router', () => {
  it('Creates a router', () => {
    const router = new Router();
    expect(router).to.be.an.instanceof(Router);
  });
});
