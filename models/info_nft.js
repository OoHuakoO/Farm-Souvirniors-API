const mongoose = require('mongoose')
const Schema = mongoose.Schema
const info_NFTSchema = new Schema({
  name: String,
  reward: Number,
  type: String,
  price : Number,
  cost : Object,
  energyConsumed : Number
})
module.exports = mongoose.model('info_NFT', info_NFTSchema)