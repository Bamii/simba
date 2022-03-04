const { Schema, model } = require('mongoose')

const TransactionSchema = Schema({
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  from_value: { type: Number, required: true },
  to_value: { type: Number, required: true },
  origin_currency: { type: String, required: true },
  destination_currency: { type: String, required: true },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }})

module.exports = model('Transaction', TransactionSchema);
