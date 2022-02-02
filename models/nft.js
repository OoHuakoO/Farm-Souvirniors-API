const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const NFT = new Schema({
  name: String,
  reward: Number,
  type: String,
  price: Number,
  cost: Object,
  energyConsumed: Number,
  
});
module.exports = mongoose.model("NFT", NFT);
