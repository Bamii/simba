const mockData = {
  signup: {
    email: 'standard@email.com',
    password: 'random-string',
    username: 'dark',
  },
  createTransaction: {
    origin_currency: 'USD',
    destination_currency: 'NGN',
    value: 100,
    receipient: 'standard2@email.com'
  },
  signup2: {
    email: 'standard2@email.com',
    password: 'random-string',
    username: 'dark2',
  },
  signin: {
    email: 'standard@email.com',
    password: 'random-string'
  },
  login: {
    email: 'b@g.com',
    password: 'bami'
  },
  signin2: {
    email: 'standard2@email.com',
    password: 'random-string'
  }
};

module.exports = {
  mockData
}
