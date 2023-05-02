'use strict';
const { Decimal128 } = require('mongodb');
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var TransactionItemsSchema = Schema( {
  description: String,
  amount: Schema.Types.Decimal128,
  category: String,
  date: Date,
  userId: {type:ObjectId, ref:'user' }
} );

module.exports = mongoose.model( 'TransactionItems', TransactionItemsSchema );