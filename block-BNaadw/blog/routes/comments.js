var express = require('express');
var router = express.Router();
var Comment = require('../model/Comment');
var Article = require('../model/Article');

// post comments 
router.post('/:id', (req, res, next) => {
  var id = req.params.id;
  req.body.articleId = id;
  Comment.create(req.body, (err, comment) => {
    if (err) return next(err);
    Article.findByIdAndUpdate(
      id,
      { $push: { comments: comment._id } },
      (err, article) => {
        if (err) return next(err);
        res.redirect('/articles/' + article.slug);
      }
    );
  });
});

// edit 
router.get('/:id/edit', (req, res, next) => {
    let id = req.params.id;
    Comment.findById(id, (err, comment) => {
        if (err) return next(err);
        res.render('editcomment', {comment})
    })
})

// update 
router.post('/:id/update', (req, res, next) => {
    let id = req.params.id;
    Comment.findByIdAndUpdate(id, req.body).populate('articleId').exec((err, comment)=>{
        if (err) return next(err);
        res.redirect('/articles/'+comment.articleId.slug)
    })
})

// delete 
router.get('/:id/delete', (req, res, next) => {
  let id = req.params.id;
  Comment.findByIdAndDelete(id, (err, comment) => {
    if (err) return next(err);
    let articleId = comment.articleId;
    Article.findByIdAndUpdate(articleId,{$pull:{comments:id}}, (err, article) => {
      if (err) return next(err);
      res.redirect('/articles/'+ article.slug)
    });
  });
});

// likes 
router.get('/:id/likes', (req, res, next) => {
    let id = req.params.id;
    Comment.findByIdAndUpdate(id, {$inc: {likes:1}}).populate('articleId').exec((err, comment)=>{
      if (err) return next(err);
      res.redirect('/articles/'+comment.articleId.slug)
  })
})

// dislikes 
router.get('/:id/dislikes', (req, res, next) => {
    let id = req.params.id;
    Comment.findByIdAndUpdate(id, {$inc: {dislikes:1}}).populate('articleId').exec((err, comment)=>{
      if (err) return next(err);
        res.redirect('/articles/'+comment.articleId.slug)
    })
})


module.exports = router;
