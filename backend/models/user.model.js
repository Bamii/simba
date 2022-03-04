const { Schema, model } = require('mongoose')
const TransactionModel = require('./transaction.model.js')

const UserSchema = Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  created_at: Schema.Types.Date,
  updated_at: Schema.Types.Date
})

UserSchema.methods.get_account_value = async function(val) {
  const sent = TransactionModel.aggregate([
    { $match: { senderId: { $eq: this.email } } },
    { $group: { _id: "$origin_currency", total: { $sum: "$from_value" } } }
  ]).exec()
  const received = TransactionModel.aggregate([
    { $match: { receiverId: { $eq: this.email } } },
    { $group: { _id: "$destination_currency", total: { $sum: "$to_value" } } }
  ]).exec()
  const currencies = { 'GBP': 0, 'USD': 0, 'EUR': 0, 'NGN': 0}

  // run them through promise.all... and reduce each array into an object of currencies & values.
  // subtract(or add?) the values to get the guy's account value.
  const [snt, rcv] = await Promise.all([sent, received])
  const sents = snt.reduce((acc, { _id, total }) => ({...acc, [_id]: total }), {})
  const receiveds = rcv.reduce((acc, { _id, total }) => ({...acc, [_id]: total }), {})

  for(let currency of Object.keys(currencies)) {
    let final = (receiveds[currency] || 0) - (sents[currency] || 0);
    currencies[currency] = final;
  }
  return currencies;
}

UserSchema.methods.canwithdraw = async function({ currency, value }) {
  const bal = await this.get_account_value();
  return ((Number.parseFloat(bal[currency]) - Number.parseFloat(value)) > 0)
}

UserSchema.methods.transactions = async function() {
  const id = this.email;
  const transactions_1 = await TransactionModel.find({ senderId: id })
  const transactions_2 = await TransactionModel.find({ receiverId: id })
  return [...transactions_1, ...transactions_2].sort((a,b) => b.created_at - a.created_at);
}

module.exports = model('User', UserSchema);
