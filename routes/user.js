const express = require("express");
const User = require("../models/user");
const router = express.Router();

router.post("/save-user", async (req, res) => {
  const { address_wallet } = req.body;
  const user = new User({
    address_wallet,
    resource: { fruit: 0, wood: 0, meat: 0 },
    energy: 0,
  });
  User.findOne({ address_wallet: address_wallet }, async (err, result) => {
    if (err) {
      console.log(err);
    } else {
      if (result) {
        res.json({ data: result, status: "success", new_user: false });
      } else {
        await user.save((err, data) => {
          if (err) {
            console.log(err);
          } else {
            res.json({ data: data, status: "succcess", new_user: true });
          }
        });
      }
    }
  });
});

router.get("/get-user/:address_wallet", async (req, res) => {
  const { address_wallet } = req.params;
  User.findOne({ address_wallet: address_wallet }, async (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json({ data: result, status: "success" });
    }
  });
});

router.post("/add-energy", async (req, res) => {
  const { address_wallet, meat,energy } = req.body;
  User.findOne({ address_wallet: address_wallet }, async (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result.resource.meat);
      if (result.resource.meat >= meat) {
        User.updateMany(
          {
            address_wallet: address_wallet,
          },
          {
            $set: {
              "resource.meat": result.resource.meat - meat,
              energy: result.energy + energy,
            },
          },
          async (err) => {
            if (err) {
              console.log(err);
            } else {
              res.json({ data: "add energy success", status: "success" });
            }
          }
        );
      } else {
        res.json({ data: "not enough meat", status: "false" });
      }
    }
  });
});

module.exports = router;
