const mongoose = require('mongoose')
const { DB_URL } = process.env;

mongoose.connect(DB_URL, { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('welcome to mission control!!')
});
