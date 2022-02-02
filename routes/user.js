const express = require("express");
const Info_nft = require("../models/info_nft");
const router = express.Router();

router.post("/login", async (req, res) => {
  const payload = req.body;
  const info_nft = new Info_nft(payload);
  await info_nft.save();
  res.json({ payload: payload });
});

module.exports = router;
