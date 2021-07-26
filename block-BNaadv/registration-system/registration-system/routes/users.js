var express = require('express');
var router = express.Router();

var User = require('../models/User');

/* GET users listing. */
router.get('/register', function (req, res, next) {
  const error = req.flash('error')[0];
  res.render('registration', { error });
});

router.post('/register', (req, res, next) => {
  User.create(req.body, (error, user) => {
    if (error) {
      if (error.name === 'MongoError') {
        req.flash('error', 'This email is taken!');
        return res.redirect('/users/register');
      }
      if (error.name === 'ValidationError') {
        req.flash('error', error.message);
        return res.redirect('/users/register');
      }
    }
    return res.redirect('/users/login');
  });
});

router.get('/login', (req, res, next) => {
  const error = req.flash('error')[0];
  res.render('login', { error });
});

router.post('/login', (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    req.flash('error', 'Provide your credential!');
    return res.redirect('/users/login');
  }
  User.findOne({ email: email }, (err, user) => {
    if (!user) {
      req.flash('error', 'User does not exist please signup first!');
      return res.redirect('/users/login');
    }
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      if (!result) {
        req.flash('error', 'Enter valid password!');
        return res.redirect('/users/login');
      }
      res.redirect('/');
    });
  });
});

module.exports = router;
