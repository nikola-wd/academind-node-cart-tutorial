var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var csrfProtection = csrf();
router.use(csrfProtection); // all routes in this router include csrf protection



router.get('/profile', isLoggedIn, (req, res, next) => {
  res.render('user/profile');
});


router.get('/logout', (req, res, next) => {
  req.logout(); // passport's method
  res.redirect('/');
});

// checking all routes with notLoggedIn middleware guard (profile & logout is ^ so it doesn't check that route)
router.use('/', notLoggedIn, (req, res, next) => {
  next();
});


router.get('/signup', (req, res, next) => {
  var messages = req.flash('error');
  res.render('user/signup', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post('/signup', passport.authenticate('local.signup', {
  failureRedirect: '/user/signup',
  failureFlash: true
}), (req, res, next) => {
  // if we signup and user tried to checkout, after signup he will be redirected to checkout page again
  if (req.session.oldUrl) {
    var oldUrl = req.session.oldUr;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  } else {
    // normal login
    res.redirect('/user/profile');
  }
});


router.get('/signin', (req, res, next) => {
  var messages = req.flash('error');
  res.render('user/signin', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post('/signin', passport.authenticate('local.signin', {
  failureRedirect: '/user/signin',
  failureFlash: true
}), (req, res, next) => {
  // if we login and user tried to checkout, after login he will be redirected to checkout page again
  if (req.session.oldUrl) {
    var oldUrl = req.session.oldUr;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  } else {
    // normal login
    res.redirect('/user/profile');
  }
});




module.exports = router;

// route protection middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) { // isAuth is passport's method
    return next(); // continue to page
  }
  res.redirect('/'); // if not auth red to /
}


function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) { // isAuth is passport's method
    return next(); // continue to page
  }
  res.redirect('/'); // if not auth red to /
}