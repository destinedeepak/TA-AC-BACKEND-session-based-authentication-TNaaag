var express = require('express');
var router = express.Router();

var User = require('../model/users');

/* GET users listing. */
router.get('/', (req, res) => {
  console.log(req.session,"session");
  res.render('users');
})

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
    res.send('User succesfully registered');
  } catch (err) {
    return next(err);
  }
});

router.get('/login', async (req, res, next) => {
  res.render('login');
});

router.post('/login', async (req, res, next) => {
  try {
    var { email, password } = req.body;
    if (!email || !password) {
      return res.redirect('users/login');
    }
    const user = await User.findOne({ email });
    //if no user 
    if(!user){
      return res.redirect('/users/login');
    }
    // if user, compare password
    user.verifyPassword(password, (err, result)=>{
      if(err) return next(err);
      if(!result){
        return res.redirect('/users/login');
      }
      // persist loged in user information
      req.session.userId = user.id;
      res.redirect('/users');
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
