const chai = require('chai');
const chaiHttp = require('chai-http');
const debug = require('debug')('app:transactions');
const server = require('../app');
const baseURI = '/transactions';

let should = chai.should();
chai.use(chaiHttp);

const mockData = {
  createTransaction: {},
  signin: {
    email: 'standard@email.com',
    password: 'random-string'
  }
}

let token;
let id;

describe.skip('Booking', function () {
  this.beforeAll('hook', (done) => {
    chai
      .request(server)
      .post('/users/login')
      .send(mockData.signin)
      .end((err, res) => {
        na_token = res.body.data.token;
        done();
      });
  });

  describe('POST /transaction/create', () => {
    it('it should create a new transaction if the amount is appropriate', done => {
      chai
        .request(server)
        .post(`${baseURI}/`)
        .set('Authorization', `Bearer ${token}`)
        .send(mockData.createTransaction)
        .end((err, res) => {
          done();
        });
    });

    it('it should not create a new transaction if the amount is not appropriate', done => {
      const cloneMockData = Object.assign({}, mockData.createTransaction);

      chai
        .request(server)
        .post(`${baseURI}/`)
        .set('Authorization', `Bearer ${token}`)
        .send(cloneMockData)
        .end((err, res) => {
          done();
        });
    });
  });

  describe('GET /transactions', () => {});

  describe('GET /transactions/balance', () => {
    it('it should delete the booking if the user has a booking with that id', done => {
      done();
    });

    it('it should not delete the booking if the user does not have a booking with that id', done => {
      done();
    });
  })
})
