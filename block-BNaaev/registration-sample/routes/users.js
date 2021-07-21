var express = require('express');
var router = express.Router();

var User = require('../model/users');

/* GET users listing. */
router.get('/register', async function (req, res, next) {
  try {
    res.render('registerForm');
  } catch (err) {
    return next(err);
  }
});

router.post('/register', async function (req, res, next) {
  try {
    const user = await User.create(req.body);
    res.send("User succesfully registered");
  } catch (err) {;
    return next(err);
  }
});

module.exports = router;
