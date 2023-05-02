const express = require('express');
const router = express.Router();
const TransactionItems = require('../models/TransactionItems');
const User = require('../models/User');


isLoggedIn = (req,res,next) => {
    if (res.locals.loggedIn) {
      next()
    } else {
      res.redirect('/login')
    }
  }

  router.get('/transaction/',
  isLoggedIn,
  async (req, res, next) => {
    const sort = req.query.sort
    let items= await TransactionItems.find({userId:req.user._id});

    if (sort=='category') {
      items = await TransactionItems.find({userId:req.user._id})
                                    .sort({category:1}) 
    } 
    else if (sort=='date') {
      items = await TransactionItems.find({userId:req.user._id})
                                    .sort({date:-1})
    } 
    else if (sort=='amount') {
      items = await TransactionItems.find({userId:req.user._id})
                                    .sort({amount:-1})
    } 
    else if (sort=='description') {
      items = await TransactionItems.find({userId:req.user._id})
                                    .sort({description:1})
    } 
    res.render('transaction',{items,sort});
  }
);


/* add the value in the body to the list associated to the key */
router.post('/transaction',
  isLoggedIn,
  async (req, res, next) => {
      const transaction = new TransactionItems(
        {description:req.body.description,
          amount: req.body.amount,
          category: req.body.category,
          date: req.body.date,
          userId: req.user._id
        })
      await transaction.save();
      res.redirect('/transaction')
});

router.get('/transaction/remove/:itemId',
  isLoggedIn,
  async (req, res, next) => {
      console.log("inside /transaction/remove/:itemId")
      await TransactionItems.deleteOne({_id:req.params.itemId});
      res.redirect('/transaction')
});

router.get('/transaction/edit/:itemId',
  isLoggedIn,
  async (req, res, next) => {
      console.log("inside /transaction/edit/:itemId")
      const item = 
       await TransactionItems.findById(req.params.itemId);
      //res.render('edit', { item });
      res.locals.item = item
      res.render('edit')
      //res.json(item)
});

router.post('/transaction/updateTransactionItem',
  isLoggedIn,
  async (req, res, next) => {
      const {itemId,description,amount,category,date} = req.body;
      console.log("inside /transaction/complete/:itemId");
      await TransactionItems.findOneAndUpdate(
        {_id:itemId},
        {$set: {description,amount,category,date}} );
      res.redirect('/transaction')
});

router.get('/transaction/groupByCategory',
  isLoggedIn,
  async (req, res, next) => {
      const sort = req.query.sort
      items = await TransactionItems.find({userId:req.user._id})
                                    .sort({category:1}) 
      console.log("inside /transaction/groupByCategory")
      res.render('groupByCategory',{items,sort})
});

module.exports = router;