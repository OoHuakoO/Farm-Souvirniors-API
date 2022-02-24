const express = require("express");
const router = express.Router();
const {
  mintRandomBox,
  getRandomBox,
  addCountRandomBox,
} = require("../blockchain");

router.post("/mint-randombox", async (req, res) => {
  try {
    const { address_wallet, name, price, count, picture } = req.body;
    await mintRandomBox(address_wallet, name, price, count, picture)
      .then(() => {
        res.json({
          data: "mint-random-box-successfully",
          status: "success",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
});

router.get("/get-randombox", async (req, res) => {
  try {
    const result = await getRandomBox();
    res.json({
      data: result,
      status: "success",
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/add-count-random-box", async (req, res) => {
  try {
    const { address_wallet, count, indexNFT } = req.body;
    await addCountRandomBox(indexNFT, count, address_wallet)
      .then(() => {
        res.json({
          data: "add-count-random-box-successfully",
          status: "success",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
