const express = require('express');
const passport = require('passport')
const router = express.Router();
const Transaction = require('../models/transaction.model.js')
const User = require('../models/user.model.js')
const { convert, findMissingFields } = require('../utils')
const { ApplicationError, ERR_NAME } = require('../utils/Error.js')

router.use(passport.authenticate('jwt', { session: false }))

router.get('/', async function(req, res, next) {
  try {
    const { email } = req.user;
    const user = await User.findOne({ email })
    const transactions = await user.transactions()
    return res.status(200).send({ message: transactions })
  } catch (e) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
})

router.post('/create', async function(req, res, next) {
  try {
    const { origin_currency, destination_currency, value, receipient } = req.body;
    const { email } = req.user;
    const fields = ['origin_currency', 'destination_currency', 'value', 'receipient'];
    const missingFields = findMissingFields(req.body, fields);

    if(missingFields.length > 0)
      throw new ApplicationError(`missing field(s) [${missingFields.join(',')}]!`)

    if(value < 0)
      throw new ApplicationError('cannot send a negative amount. you sly creature!')

    const user = await User.findOne({ email })
    const receipientUser = await User.findOne({ email: receipient })
    const canwithdraw = await user.canwithdraw({ currency: origin_currency, value });
    if(!canwithdraw)
      throw new ApplicationError(`you do not have sufficient balance in your ${origin_currency} acount.`)

    // new transaction to receiver...
    const { to_value, rate } = await convert({ origin_currency, destination_currency, value });
    const transaction = new Transaction({
      senderId: email, receiverId: receipientUser.email,
      from_value: value, to_value,
      origin_currency, destination_currency
    })
    transaction.save();
    res.status(200).send({ message: 'successfully sent funds.', transaction });
  } catch (e) {
    if(e.name === ERR_NAME) {
      res.status(200).send({ error: true, message: e.message });
    } else {
      res.status(500).send({ error: true, message: 'Internal Server Error' });
    }
  }
});

router.get('/balance', async function(req, res, next) {
  try {
    const { email } = req.user;
    const user = await User.findOne({ email })
    const bal = await user.get_account_value()
    return res.status(200).send({ message: bal })
  } catch (e) {
    res.status(200).send({ message: 'Internal Server Error' });
  }
})

module.exports = router;
