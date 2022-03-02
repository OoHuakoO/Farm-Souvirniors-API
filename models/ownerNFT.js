const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ownerNFT = new Schema({
  address_wallet : String,
  nft_id: String,
  name: String,
  picture : String,
  reward: Number,
  type: String,
  price: Number,
  cost: Object,
  energy_consumed: Number,
  amount_food: Number,
  status: String,
  timeFeed: Date,
  timeHarvest: Date,
  position_plant : Number
});
module.exports = mongoose.model("owner_nft", ownerNFT);
