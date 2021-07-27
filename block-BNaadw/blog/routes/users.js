var express = require('express');
var router = express.Router();

var User = require('../model/User');

router.get('/register', (req, res, next) => {
  const error = req.flash('error')[0];
  res.render('registration', { error });
});

router.post('/register', (req, res, next) => {
  var { email, password } = req.body;
  User.create(req.body, (error, user) => {
    if (error) {
      if (error.name === 'MongoError') {
        req.flash('error', 'This email is taken');
        return res.redirect('/users/register');
      }
      if (error.name === 'ValidationError') {
        req.flash('error', error.message);
        return res.redirect('/users/register');
      }
    }
    res.redirect('/users/login');
  });
});

router.get('/login', (req, res, next) => {
  const error = req.flash('error')[0];
  res.render('login', { error });
});

router.post('/login', (req, res, next) => {
  var { email, password } = req.body;
  if (!email && !password) {
    req.flash('error', 'Enter your credential!');
    return res.redirect('/users/login');
  }
  User.findOne({ email }, (error, user) => {
    if (error) return next(error);
    if (!user) {
      req.flash('error', 'User does not exist please signup first!');
      return res.redirect('/users/login');
    }
    user.verifyPassword(password, (error, result) => {
      if (error) return next(error);
      if (!result) {
        req.flash('error', 'Password is invalid!');
        return res.redirect('/users/login');
      }
      //   persist logged in user info
      req.session.userId = user.id;
      req.flash('fullName', user.fullName());
      res.redirect('/articles');
    });
  });
});

router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/users/login');
});

module.exports = router;
