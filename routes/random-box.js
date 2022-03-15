const express = require("express");
const router = express.Router();
const Info_nft = require("../models/info_nft");
const Owner_nft = require("../models/ownerNFT");
const User = require("../models/user");
router.post("/open-randombox", async (req, res) => {
  try {
    const { pid, address_wallet, name } = req.body;
    Info_nft.findOne({ name: name }, async (err, data) => {
      if (err) {
        console.log(err);
      } else {
        const owner_nft = new Owner_nft({
          address_wallet: address_wallet,
          nft_id: pid,
          name: data.name,
          picture: data.picture,
          reward: data.reward,
          type: data.type,
          cost: data.cost,
          energy_consumed: data.energy_consumed,
          amount_food: data.amount_food,
          status: "not_plant",
          price: 0,
        });
        await owner_nft.save(async (err, data) => {
          if (err) {
            console.log(err);
          } else {
            User.findOne(
              { address_wallet: address_wallet },
              async (err, result) => {
                if (err) {
                  console.log(err);
                } else {
                  result.listNFT.push(data);
                  await result.save((err, data) => {
                    if (err) console.log(err);
                    else {
                      res.json({
                        data: data,
                        status: "success",
                      });
                    }
                  });
                }
              }
            );
          }
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
