var express = require('express');
const passport = require('passport');
var router = express.Router();
const User = require('../models/user.model.js')
const Transaction = require('../models/transaction.model.js')
const { ApplicationError, ERR_NAME } = require('../utils/Error.js')
const { comparePassword, hashPassword, generateToken, findMissingFields } = require('../utils')

/* GET home page. */
router.get('/', passport.authenticate('jwt', { session: false }), async function(req, res, next) {
  try {
    const { email } = req.user;
    let users = await User.find();
    users = users
      .map(e => ({ username: e.username, email: e.email }))
      .filter(e => e.email !== email)
    res.status(200).send({ message: users });
  } catch (e) {
    res.status(500).send({ error: true, message: "Internal Server Error" })
  }
});

router.post('/login', async function(req, res, next) {
  try {
    const { email, password } = req.body;
    const fields = ['email', 'password'];
    const missingFields = findMissingFields(req.body, fields);

    if(missingFields.length > 0)
      throw new ApplicationError(`missing field(s) [${missingFields.join(',')}]!`)

    const user = await User.findOne({ email })
    if(!user) throw new ApplicationError('email or password incorrect!')
    if(!comparePassword(password, user.password)) throw new ApplicationError('email or password incorrect!')

    res.status(200).send({
      token: generateToken({ payload: { username: user.username, email, iat: Date.now() }}),
      user: { email, username: user.username }
    });
  } catch (e) {
    console.log(e)
    if(e.name === ERR_NAME) {
      res.status(200).send({ error: true, message: e.message });
    } else {
      res.status(500).send({ error: true, message: 'Internal Server Error' });
    }
  }
});

router.post('/signup', async function(req, res, next) {
  try {
    const { username, email, password: _password } = req.body;
    const fields = ['username', 'email', 'password'];
    const missingFields = findMissingFields(req.body, fields);

    if(missingFields.length > 0)
      throw new ApplicationError(`missing field(s) [${missingFields.join(',')}]!`)

    let user = await User.findOne({ email }).exec();
    if(user) throw new ApplicationError('user already exists');
    user = await User.findOne({ username }).exec();
    if(user) throw new ApplicationError('user already exists');

    const password = hashPassword({ password: _password })
    user = new User({ username, email, password })
    user.save()

    const transaction = new Transaction({
      receiverId: user.email, from_value: 1000, to_value: 1000,
      origin_currency: 'USD', destination_currency: 'USD', senderId: 'Bank'
    });
    transaction.save()
    res.status(200).send({ message: 'congratulations on signing up!. please login now.' });
  } catch (e) {
    if(e.name === ERR_NAME) {
      res.status(200).send({ error: true, message: e.message });
    } else {
      res.status(500).send({ error: true, message: 'Internal Server Error' });
    }
  }
});

module.exports = router;
