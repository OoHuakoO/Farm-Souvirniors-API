const express = require("express");
const router = express.Router();
const { mintRandomBox, getRandomBox } = require("../blockchain");

router.post("/mint-randombox", async (req, res) => {
  try {
    const { address_wallet, name, price, count, picture } = req.body;
    const pid = Date.now();
    await mintRandomBox(address_wallet, name, pid, price, count, picture)
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

module.exports = router;
