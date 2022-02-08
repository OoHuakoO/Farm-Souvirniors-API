const mongoose = require('mongoose')
const Schema = mongoose.Schema
const info_NFTSchema = new Schema({
  name: String,
  picture : String,
  reward: Number,
  type: String,
  price : Number,
  cost : Object,
  energy_consumed : Number,
  amount_food : Number
})
module.exports = mongoose.model('info_NFT', info_NFTSchema)