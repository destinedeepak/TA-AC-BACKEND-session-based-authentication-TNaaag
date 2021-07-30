var express = require('express');
var router = express.Router();

var Product = require('../models/Product');

// GET new
router.get('/new', (req, res, next) => {
  if (!req.session.adminId) {
    req.flash('error', 'Login as admin to create new product!');
    res.redirect('/');
  }
  res.render('product');
});
// POST product
router.post('/', (req, res, next) => {
  Product.create(req.body, (error, result) => {
    if (error) return next(error);
    res.redirect('/products');
  });
});
// GET all product
router.get('/', (req, res, next) => {
  console.log(req.session)
  if (req.session.adminId || req.session.userId) {
    Product.find({}, (error, products) => {
      if (error) return next(error);
      res.render('products', { products });
    });
  } else {
    req.flash('error', 'Login first to check products!');
    res.redirect('/');
  }
});

// GET product details
router.get('/:id', (req, res, next) => {
  if (req.session.adminId || req.session.userId) {
    const id = req.params.id;
    Product.findById(id, (err, product) => {
      if (err) return next(err);
      const error = req.flash('error')[0];
      res.render('productDetails', { product, error});
    });
  } else {
    req.flash('error', 'Login first to check products!');
    res.redirect('/');
  }
});

// likes
router.get('/:id/like', (req, res, next) => {
  if (req.session.adminId || req.session.userId) {
    const id = req.params.id;
    Product.findByIdAndUpdate(id, { $inc: { like: 1 } }, (error, product) => {
      if (error) return next(error);
      res.redirect('/products/' + product.id);
    });
  } else {
    req.flash('error', 'Login first to check products!');
    res.redirect('/');
  }
});

// edit
router.get('/:id/edit', (req, res, next) => {
  const id = req.params.id;
  if (!req.session.adminId) {
    req.flash('error', 'Login as admin to edit products!');
    res.redirect('/products/' + id);
  }
  Product.findById(id, (error, product) => {
    if (error) return next(error);
    res.render('editProduct', { product });
  });
});

// update
router.post('/:id/update', (req, res, next) => {
  const id = req.params.id;
  Product.findByIdAndUpdate(id, req.body, (error, product) => {
    if (error) return next(error);
    res.redirect('/products/' + id);
  });
});
// delete
router.get('/:id/delete', (req, res, next) => {
  const id = req.params.id;
  if (!req.session.adminId) {
    req.flash('error', 'Login as admin to delete products!');
    return res.redirect('/products/'+id);
  }
  Product.findByIdAndDelete(id, (error, product) => {
    if (error) return next(error);
    res.redirect('/products');
  });
});

module.exports = router;
