const express = require("express");
const Info_nft = require("../models/info_nft");
const Owner_nft = require("../models/ownerNFT");
const User = require("../models/user");
const router = express.Router();
const { craftNFT, getDetailNFT, getOwnerNft } = require("../blockchain");
router.post("/create-info-nft", async (req, res) => {
  const payload = req.body;
  const info_nft = new Info_nft(payload);
  await info_nft.save((err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.json({ data: data, status: 200 });
    }
  });
});
router.get("/info-nft", async (req, res) => {
  Info_nft.find({}, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.json({ data: data, status: 200 });
    }
  });
});

router.post("/craft-nft", async (req, res) => {
  try {
    const {
      name,
      reward,
      type,
      cost,
      energy_consumed,
      amount_food,
      address_wallet,
    } = req.body;
    const pid = Date.now();
    await craftNFT(
      pid,
      name,
      reward,
      type,
      cost.wood,
      cost.fruit,
      energy_consumed,
      amount_food
    )
      .then(async () => {
        const owner_nft = new Owner_nft({
          pid,
          name,
          reward,
          type,
          cost,
          energy_consumed,
          amount_food,
          status: "not_use",
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
                      res.json({ data: data, status: "success" });
                    }
                  });
                }
              }
            );
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
});

router.get("/get-detail-nft/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const response = await getDetailNFT(id);
    return res.json({
      data: response.data,
      status: "success",
    });
  } catch (err) {
    console.log(err);
  }
});
router.get("/get-owner-nft/:address", async (req, res) => {
  try {
    const address = req.params.address;
    const response = await getOwnerNft(address);
    return res.json({
      data: response,
      status: "success",
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
