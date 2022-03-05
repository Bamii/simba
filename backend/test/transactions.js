const chai = require('chai');
const chaiHttp = require('chai-http');
const debug = require('debug')('app:transactions');
const server = require('../app');
// const server = 'http://localhost:3000'
const baseURI = '/transactions';
const { mockData } = require('./constants')

let should = chai.should();
chai.use(chaiHttp);

let transaction_id;
let token;
let id;
describe('Transactions', function () {
  this.beforeAll('hook', (done) => {
    chai
      .request(server)
      .post(`/users/login`)
      .send(mockData.signin)
      .end((err, res) => {
        const { token: _token, user } = res.body;
        token = _token;
        done();
      });
  });

  describe('POST /transactions/create', () => {
    it('it should fail if any required fields are missing', done => {
      let mockDataClone = Object.assign({}, mockData.createTransaction);
      const idx = Math.floor(Math.random() * Object.keys(mockDataClone).length);
      const key = Object.keys(mockDataClone)[idx]
      delete mockDataClone[key];

      chai
        .request(server)
        .post(`${baseURI}/create`)
        .set('Authorization', `Bearer ${token}`)
        .send(mockDataClone)
        .end((err, res) => {
          const { error, message } = res.body;

          should.not.exist(err);
          res.status.should.eql(200);
          res.type.should.eql('application/json');

          should.exist(error);
          should.exist(message);
          error.should.eql(true);
          message.should.be.a('string');
          message.should.eql(`missing field(s) [${key}]!`)
          done();
        });
    });

    it('it should create a new transaction if there is enough money in the acct.', done => {
      chai
        .request(server)
        .post(`${baseURI}/create`)
        .set('Authorization', `Bearer ${token}`)
        .send(mockData.createTransaction)
        .end((err, res) => {
          const { transaction, message } = res.body;
          should.not.exist(err);
          res.status.should.eql(200);
          res.type.should.eql('application/json');

          should.exist(transaction);
          should.exist(message);
          transaction_id = transaction._id;
          transaction.should.be.an('object');
          should.exist(transaction.senderId)
          should.exist(transaction.receiverId)
          should.exist(transaction.origin_currency)
          should.exist(transaction.destination_currency)
          should.exist(transaction.from_value)
          should.exist(transaction.to_value)
          done();
        });
    });

    it('it should not create a new transaction if insufficient funds', done => {
      let mockDataClone = Object.assign({}, mockData.createTransaction);
      mockDataClone.value = 1000000;

      chai
        .request(server)
        .post(`${baseURI}/create`)
        .set('Authorization', `Bearer ${token}`)
        .send(mockDataClone)
        .end((err, res) => {
          const { error, message } = res.body;

          should.not.exist(err);
          res.status.should.eql(200);
          res.type.should.eql('application/json');

          should.exist(error);
          should.exist(message);
          error.should.eql(true);
          message.should.be.a('string');
          message.should.eql(`you do not have sufficient balance in your ${mockDataClone.origin_currency} acount.`)
          done();
        });
    });

    it('it should not create a new transaction if you send in a negative value', done => {
      let mockDataClone = Object.assign({}, mockData.createTransaction);
      mockDataClone.value = -100;

      chai
        .request(server)
        .post(`${baseURI}/create`)
        .set('Authorization', `Bearer ${token}`)
        .send(mockDataClone)
        .end((err, res) => {
          const { error, message } = res.body;

          should.not.exist(err);
          res.status.should.eql(200);
          res.type.should.eql('application/json');

          should.exist(error);
          should.exist(message);
          error.should.eql(true);
          message.should.be.a('string');
          message.should.eql(`cannot send a negative amount. you sly creature!`)
          done();
        });
    });
  });

  describe('GET /transactions', () => {
    it('it should return a list of transactions... 2 transactions in this case. initial, and earlier transaction.', done => {
      chai
        .request(server)
        .get(`${baseURI}`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          const { message } = res.body;

          should.not.exist(err);
          res.status.should.eql(200);
          res.type.should.eql('application/json');

          should.exist(message)
          message.should.be.an('array')
          // message.length.should.eql(2)
          done();
        });
    });
  });

  describe('GET /transactions/balance', () => {
    it('it should return the balance of the user', done => {
      chai
        .request(server)
        .get(`${baseURI}/balance`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          const { message } = res.body;

          should.not.exist(err);
          res.status.should.eql(200);
          res.type.should.eql('application/json');

          should.exist(message)
          should.exist(message.EUR)
          should.exist(message.USD)
          should.exist(message.GBP)
          should.exist(message.NGN)
          // message.USD.should.eql(900)
          // message.EUR.should.eql(0)
          // message.GBP.should.eql(0)
          // message.NGN.should.eql(0)
          done();
        });
    });
  })
})
