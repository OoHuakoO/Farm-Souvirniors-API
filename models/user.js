const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const user = new Schema({
  address_wallet: String,
  resource: Object,
  energy: Number,
  listNFT: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "owner_nft",
    },
  ],
});
module.exports = mongoose.model("user", user);
