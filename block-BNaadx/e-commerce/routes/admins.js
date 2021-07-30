var express = require('express');
var router = express.Router();

var Admin = require('../models/Admin');

router.get('/signup', (req, res, next) => {
  const error = req.flash('error')[0];
  res.render('adminSignup', { error });
});

router.post('/signup', (req, res, next) => {
  var { email, password, name } = req.body;
  if (!email && !password && !name) {
    req.flash('error', 'Enter your credential!');
    return res.redirect('/admins/signup');
  }
  Admin.create(req.body, (error, admin) => {
    if (error) {
      if (error.name === 'MongoError') {
        req.flash('error', 'Admin already exsits!');
        return res.redirect('/admins/signup');
      }
      if (error.name === 'ValidationError') {
        req.flash('error', error.message);
        return res.redirect('/admins/signup');
      }
    }
    res.redirect('/admins/login');
  });
});

router.get('/login', (req, res, next) => {
  const error = req.flash('error')[0];
  res.render('adminLogin', { error });
});

router.post('/login', (req, res, next) => {
  var { password, email } = req.body;
  if (!email && !password) {
    req.flash('error', 'Enter your credential!');
    return res.redirect('/admins/login');
  }
  Admin.findOne({ email }, (error, admin) => {
      if(error) return next(error);
    if (!admin) {
      req.flash('error', 'Admin does not exist!');
      return res.redirect('/admins/login');
    }
    admin.comparePassword(password, (error, result) => {
      if(error) return next(error);
      if (!result) {
        req.flash('error', 'password is wrong!');
        return res.redirect('/admins/login');
      }
      req.session.adminId = admin.id;
      res.redirect('/products');
    });
  });
});

module.exports = router;
