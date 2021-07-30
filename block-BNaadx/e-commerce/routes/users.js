var express = require('express');
var router = express.Router();

var User = require('../models/User');

router.get('/signup', (req, res, next) => {
  const error = req.flash('error')[0];
  res.render('userSignup', { error });
});

router.post('/signup', (req, res, next) => {
  var { email, password, name } = req.body;
  if (!email && !password && !name) {
    req.flash('error', 'Enter your credential!');
    return res.redirect('/users/signup');
  }
  User.create(req.body, (error, user) => {
    if (error) {
      if (error.name === 'MongoError') {
        req.flash('error', 'Admin already exsits!');
        return res.redirect('/users/signup');
      }
      if (error.name === 'ValidationError') {
        req.flash('error', error.message);
        return res.redirect('/users/signup');
      }
    }
    res.redirect('/users/login');
  });
});

router.get('/login', (req, res, next) => {
  const error = req.flash('error')[0];
  res.render('userLogin', {error});
});

router.post('/login', (req, res, next) => {
  var { password, email } = req.body;
  if (!email && !password) {
    req.flash('error', 'Enter your credential!');
    return res.redirect('/users/login');
  }
  User.findOne({ email }, (error, user) => {
    if (!user) {
      req.flash('error', 'user does not exist!');
      return res.redirect('/users/login');
    }
    user.comparePassword(password, (error, result) => {
      if (error) return next(error);
      if (!result) {
        req.flash('error', 'password is wrong!');
        return res.redirect('/users/login');
      }
      req.session.userId = user.id;
      res.redirect('/products');
    });
  });
});

module.exports = router;
