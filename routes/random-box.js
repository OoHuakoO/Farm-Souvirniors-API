const express = require("express");
const router = express.Router();

router.post("/open-randombox", async (req, res) => {
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


module.exports = router;