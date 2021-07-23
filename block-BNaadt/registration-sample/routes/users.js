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
    const error = req.flash('error')[0];
    res.render('registerForm', {error});
  } catch (err) {
    return next(err);
  }
});

router.post('/register', async function (req, res, next) {
  User.create(req.body, (err, user) => {
    if(err){
      req.flash("error", "Enter valid username and password!");
      return res.redirect('/users/register')
    }
    res.redirect('/users/login');
  })
});

router.get('/login', async (req, res, next) => {
  const error = req.flash('error')[0];
  res.render('login',{error});
});

router.post('/login', async (req, res, next) => {
  try {
    var { email, password } = req.body;
    if (!email || !password) {
      req.flash("error", "Provide your credential!")
      return res.redirect('/users/login');
    }
    const user = await User.findOne({ email });
    //if no user 
    if(!user){
      req.flash("error", "User does not exist please sign up first")
      return res.redirect('/users/login');
    }
    // if user, compare password
    user.verifyPassword(password, (err, result)=>{
      if(err) return next(err);
      if(!result){
        req.flash("error", "Enter valid password!")
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

router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/users/login');
})

module.exports = router;
