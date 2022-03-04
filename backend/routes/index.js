var express = require('express');
var router = express.Router();
const User = require('../models/user.model.js')
const Transaction = require('../models/transaction.model.js')
const { comparePassword, hashPassword, generateToken } = require('../utils')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', async function(req, res, next) {
  res.render('auth', { type: 'login' })
});

router.get('/signup', async function(req, res, next) {
  res.render('auth', { type: 'signup' })
});

router.get('/dashboard', function() {
  res.render('dashboard')
})

module.exports = router;
