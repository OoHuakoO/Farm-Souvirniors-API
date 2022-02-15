const express = require("express");
const User = require("../models/user");
const router = express.Router();

router.get("/get-owner-nft/:address", async (req, res) => {
  try {
    const address = req.params.address;
    User.findOne({ address_wallet: address })
      .populate("listNFT")
      .exec(async (error, result) => {
        if (error) {
          console.log(error);
        } else {
          return res.json({
            data: result.listNFT,
            status: "success",
          });
        }
      });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
