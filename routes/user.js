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

router.post("/add-energy", async (req, res) => {
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


module.exports = router;
