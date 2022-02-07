const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ownerNFT = new Schema({
  nft_id: String,
  name: String,
  reward: Number,
  type: String,
  price: Number,
  cost: Object,
  energy_consumed: Number,
  amount_food: Number,
  status: String,
  cooldownTimeFeed: Date,
  cooldownTimeHarvest: Date,
});
module.exports = mongoose.model("owner_nft", ownerNFT);
