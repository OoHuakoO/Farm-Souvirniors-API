const express = require("express");
const Info_nft = require("../models/info_nft");
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
    const { name, reward, type, cost, energyConsumed } = req.body;
    const response = await craftNFT(
      Date.now(),
      name,
      reward,
      type,
      cost.wood,
      cost.fruit,
      energyConsumed
    );
    return res.json({
      response,
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
