var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const error = req.flash('error')[0];
  res.render('index', { title: 'E-Commerce', error});
});

router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.clearCookie('adminId');
  // req.flash('error','You are logged out, Log in again to check products!')
  res.redirect('/');
})

module.exports = router;
