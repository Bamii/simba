const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { PASSWORD_SECRET, EXCHANGE_ACCESS_KEY } = process.env;
const axios = require('axios');

function getType(o) {
  if (o === null) return "null";
  if (o === undefined) return "undefined";
  return Object.prototype.toString.call(o).slice(8, -1);
}

async function convert({ origin_currency, destination_currency, value }) {
  const url = `https://v6.exchangerate-api.com/v6/${EXCHANGE_ACCESS_KEY}/pair/${origin_currency}/${destination_currency}/${value}`
  const url2 = 'https://api.exchangeratesapi.io/v1/convert?access_key=' + EXCHANGE_ACCESS_KEY + '&from=' + origin_currency + '&to=' + destination_currency + '&amount=' + value
  const res = await axios.get(url)
  // if(res)
  console.log(res);
  return { from_value:value, to_value: res.conversion_result , rate: res.conversion_rate };
}

function getVersionNumber() {
  return 1;
}

function findMissingFields(data, fields) {
  const f = [...fields]
  return f.reduce((acc, curr) => data[curr] === undefined ? [curr, ...acc] : acc, []);
}

// hmmmmm...
function buildResponse(type, data, extras) {
  const d = { status: type };

  d[type === 'success' ? 'data' : 'error'] = data;

  if (getType(extras).toLowerCase() === 'object') {
    d.extras = {...extras};
  }
  return d;
}

function hashPassword({ password, saltingRounds = 10 }) {
  return bcrypt.hashSync(password, saltingRounds);
}

function comparePassword(text, hash) {
  return bcrypt.compareSync(text, hash);
}

function generateToken(options) {
  const { payload, secret = PASSWORD_SECRET, jwtOpts } = options;

  return jwt.sign(payload, secret);
}

module.exports = {
  getVersionNumber,
  findMissingFields,
  buildResponse,
  hashPassword,
  comparePassword,
  generateToken,
  getType,
  convert
};
