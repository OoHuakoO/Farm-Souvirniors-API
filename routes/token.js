const express = require("express");
const router = express.Router();
const User = require("../models/user");
router.post("/depositToken", async (req, res) => {
  const { address_wallet, value, type } = req.body;
  User.findOne({ address_wallet: address_wallet }, (err, result) => {
    if (err) {
      console.log(err);
    }
    if (type === "Fruit") {
      User.updateMany(
        { address_wallet: address_wallet },
        {
          $set: {
            "resource.fruit": result.resource.fruit + value,
          },
        },
        (err) => {
          if (err) {
            console.log(err);
          } else {
            res.json({ data: "deposit success", status: "success" });
          }
        }
      );
    } else if (type === "Wood") {
      User.updateMany(
        { address_wallet: address_wallet },
        {
          $set: {
            "resource.wood": result.resource.wood + value,
          },
        },
        (err) => {
          if (err) {
            console.log(err);
          } else {
            res.json({ data: "deposit success", status: "success" });
          }
        }
      );
    } else {
      User.updateMany(
        { address_wallet: address_wallet },
        {
          $set: {
            "resource.meat": result.resource.meat + value,
          },
        },
        (err) => {
          if (err) {
            console.log(err);
          } else {
            res.json({ data: "deposit success", status: "success" });
          }
        }
      );
    }
  });
});

router.post("/check-resource", async (req, res) => {
  const { address_wallet, value, type } = req.body;
  User.findOne({ address_wallet: address_wallet }, (err, result) => {
    if (err) {
      console.log(err);
    }
    if (type === "Fruit") {
      if (result.resource.fruit >= value) {
        res.json({ data: "can withdraw token", status: "success" });
      } else {
        res.json({ data: "not enough resource", status: "false" });
      }
    } else if (type === "Wood") {
      if (result.resource.wood >= value) {
        res.json({ data: "can withdraw token", status: "success" });
      } else {
        res.json({ data: "not enough resource", status: "false" });
      }
    } else {
      if (result.resource.meat >= value) {
        res.json({ data: "can withdraw token", status: "success" });
      } else {
        res.json({ data: "not enough resource", status: "false" });
      }
    }
  });
});

router.post("/withdrawToken", async (req, res) => {
  const { address_wallet, value, type } = req.body;
  User.findOne({ address_wallet: address_wallet }, (err, result) => {
    if (err) {
      console.log(err);
    }
    if (type === "Fruit") {
      User.updateMany(
        { address_wallet: address_wallet },
        {
          $set: {
            "resource.fruit": result.resource.fruit - value,
          },
        },
        (err) => {
          if (err) {
            console.log(err);
          } else {
            res.json({ data: "withdraw success", status: "success" });
          }
        }
      );
    } else if (type === "Wood") {
      User.updateMany(
        { address_wallet: address_wallet },
        {
          $set: {
            "resource.wood": result.resource.wood - value,
          },
        },
        (err) => {
          if (err) {
            console.log(err);
          } else {
            res.json({ data: "withdraw success", status: "success" });
          }
        }
      );
    } else {
      User.updateMany(
        { address_wallet: address_wallet },
        {
          $set: {
            "resource.meat": result.resource.meat - value,
          },
        },
        (err) => {
          if (err) {
            console.log(err);
          } else {
            res.json({ data: "withdraw success", status: "success" });
          }
        }
      );
    }
  });
});

module.exports = router;
