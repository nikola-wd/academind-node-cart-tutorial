var express = require('express');
var router = express.Router();

var Product = require('../models/product');
var Cart = require('../models/cart');
var Order = require('../models/order');



/* GET home page. */
router.get('/', (req, res, next) => {
  var successMsg = req.flash('success')[0];
  Product.find((err, products) => {
    var productChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < products.length; i+=chunkSize) {
      productChunks.push(products.slice(i, i + chunkSize));
    }
    res.render('shop/index', { title: 'Express', products: productChunks, successMsg: successMsg, noMessages: !successMsg });
  });
});


// route for adding to cart 
router.get('/add-to-cart/:id', (req, res, next) => {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, (err, product) => {
    if (err) {
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');
  });
});

// shopping cart page 
router.get('/shopping-cart', (req, res, next) => {
  if (!req.session.cart) {
    return res.render('shop/shopping-cart', {products: null});
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

// checkout route
router.get('/checkout', isLoggedIn, (req, res, next) => {
  if (!req.session.cart) {
    // return res.render('shop/shopping-cart', { products: null });
    return res.redirect('shop/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});

// finish payment 
router.post('/checkout', isLoggedIn, (req, res, next) => {
  if (!req.session.cart) {
    return res.redirect('shop/shopping-cart');
  }
  var cart = new Cart(req.session.cart);

  var stripe = require("stripe")(
    "sk_test_eviVP5HLzRY3ldF9FQuj08FJ"
  );

  stripe.charges.create({
    amount: cart.totalPrice * 100,
    currency: "usd",
    source: req.body.stripeToken, // obtained with Stripe.js
    description: "Test charge"
  }, function (err, charge) {
    // asynchronously called
    if (err) {
      req.flash('error', err.message);
      return res.redirect('/checkout');
    }
    // save order to DB and then empty cart and redirect
    var order = new Order({
      user: req.user,
      cart: cart,
      address: req.body.address,
      name: req.body.name,
      paymentId: charge.id
    });
    order.save((err, result) => {
      req.flash('success', 'Succesfully bought a product');
      req.session.cart = null;
      res.redirect('/');
    });
  });
  

});

module.exports = router;


// route protection middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) { // isAuth is passport's method
    return next(); // continue to page
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/signin'); // if not auth red to /
}