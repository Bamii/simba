const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
// const client = require('../db');

const baseURI = '/users';

let should = chai.should();
chai.use(chaiHttp);

const mockData = {
  signup: {
    email: 'standard@email.com',
    password: 'random-string',
    username: 'dark',
  },
  signin: {
    email: 'standard@email.com',
    password: 'random-string'
  }
};

describe.skip('User', function() {
  describe('/POST /users/signup', function() {
    it('should register a new user', done => {
      chai
        .request(server)
        .post(`${baseURI}/signup`)
        .send(mockData.signup)
        .end((err, res) => {
          const { status, data } = res.body;

          should.not.exist(err);
          res.redirects.length.should.eql(0);
          res.status.should.eql(200);
          res.type.should.eql('application/json');

          status.should.eql('success');
          should.exist(data);
          data.should.be.an('object');
          should.exist(data.message);
          data.token.should.be.a('string');
          done();
        });
    });

    it('it should not register the user if there are ANY missing fields.', done => {
      let mockDataClone = Object.assign({}, mockData.signup);
      const randomKey = Math.floor(Math.random() * Object.keys(mockDataClone).length);
      delete mockDataClone[Object.keys(mockDataClone)[randomKey]];

      chai
        .request(server)
        .post(`${baseURI}/signup`)
        .send(mockDataClone)
        .end((err, res) => {
          const { error, message } = res.body;

          should.not.exist(err);
          res.redirects.length.should.eql(0);
          res.status.should.eql(200);
          res.type.should.eql('application/json');

          should.exist(error);
          should.exist(message);
          error.should.eql(true);
          message.should.be.a('string');
          done();
        });
    });

    it("it should not register the user if there's a user with the same email on the system", done => {
      chai
        .request(server)
        .post(`${baseURI}/signup`)
        .send(mockData.signup)
        .end((err, res) => {
          const { error, message } = res.body;

          should.not.exist(err);
          should.not.exist(err);
          res.redirects.length.should.eql(0);
          res.type.should.eql('application/json');
          res.status.should.eql(200);

          should.exist(error);
          should.exist(message);
          error.should.be(true);
          message.should.be.a('string');
          message.should.equal('user already exists');
          done();
        });
    });
  });

  describe('/POST /users/login', function() {
    it('it should sign the user in', done => {
      chai
        .request(server)
        .post(`${baseURI}/login`)
        .send(mockData.signin)
        .end((err, res) => {
          const { user, token } = res.body;

          should.not.exist(err);
          res.redirects.length.should.eql(0);
          res.type.should.eql('application/json');
          res.status.should.eql(200);

          should.exist(user);
          should.exist(token);
          user.should.be.an('object');
          should.exist(user.username);
          should.exist(user.email);
          token.should.be.a('string');
          user.username.should.be.a('string');
          user.email.should.be.a('string');
          done();
        });
    });

    it('it should not sign the user in if there are ANY fields missing.', done => {
      const mockDataClone = Object.assign({}, mockData.signin);
      delete mockDataClone.email;

      chai
        .request(server)
        .post(`${baseURI}/login`)
        .send(mockDataClone)
        .end((err, res) => {
          const { error, message } = res.body;

          should.not.exist(err);
          res.redirects.length.should.eql(0);
          res.type.should.eql('application/json');
          res.status.should.eql(200);

          should.exist(error);
          should.exist(message);
          message.should.be.a('string');
          error.should.be(true);
          done();
        });
    });

    it("it should not sign the user in if they're not present in the system", done => {
      const mockDataClone = Object.assign({}, mockData.signin);
      mockDataClone.email = 'test@g.com';

      chai
        .request(server)
        .post(`${baseURI}/login`)
        .send(mockDataClone)
        .end((err, res) => {
          const { message, error } = res.body;

          should.not.exist(err);
          res.redirects.length.should.eql(0);
          res.type.should.eql('application/json');
          res.status.should.eql(200);

          should.exist(message);
          should.exist(error);
          error.should.eql(true);
          message.should.equal('email or password incorrect!');
          done();
        });
    })

    it("it should not sign the user in if they use a wrong password", done => {
      const mockDataClone = Object.assign({}, mockData.signin);
      mockDataClone.password = 'somethingelseentirely';

      chai
        .request(server)
        .post(`${baseURI}/login`)
        .send(mockDataClone)
        .end((err, res) => {
          const { message, error } = res.body;

          should.not.exist(err);
          res.redirects.length.should.eql(0);
          res.type.should.eql('application/json');
          res.status.should.eql(200);

          should.exist(message);
          should.exist(error);
          error.should.eql(true);
          message.should.equal('email or password incorrect!');
          done();
        });
    })
  });
});

// clean db after...
