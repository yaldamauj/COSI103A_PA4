/*
    summary.js -- Router for the summary (group by category) page
*/
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const TransactionItem = require('../models/TransactionItems');

isLoggedIn = (req,res,next) => {
    if (res.locals.loggedIn) {
      next()
    } else {
      res.redirect('/login')
    }
}

router.get('/summary', async (req, res) => {
    let result = await TransactionItem.aggregate([
        { $match: { userid: {userId:req.user._id} } },
        { $group: { _id: '$category', total: { $sum: '$amount' } } },
        { $sort: { total: -1} },
    ]);

    res.render('summary', { result });
});
module.exports = router