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
    Info_nft.findOne({ name: name }, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        User.findOne(
          { address_wallet: address_wallet },
          async (err, result) => {
            if (err) {
              console.log(err);
            } else {
              if (
                result.resource.fruit < data.cost.fruit ||
                result.resource.wood < data.cost.wood ||
                result.energy < data.energy_consumed
              ) {
                res.json({ data: "please add resource", status: "false" });
              } else {
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
                      nft_id: pid,
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
                              User.updateMany(
                                {
                                  address_wallet: address_wallet,
                                },
                                {
                                  $set: {
                                    "resource.fruit":
                                      result.resource.fruit - cost.fruit,
                                    "resource.wood":
                                      result.resource.wood - cost.wood,
                                    energy: result.energy - energy_consumed,
                                  },
                                },
                                async (err) => {
                                  if (err) {
                                    console.log(err);
                                  } else {
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
                          }
                        );
                      }
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }
            }
          }
        );
      }
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

router.get("/webhook/get-owner-nft/:address", async (req, res) => {
  try {
    const address = req.params.address;
    const response = await getOwnerNft(address);
    User.findOne({ address_wallet: address })
      .populate("listNFT")
      .exec(async (error, result) => {
        if (error) {
          console.log(error);
        } else {
          await response.map(
            async (dataFromSmartContract, indexFromSmartContract) => {
              await result.listNFT.map((dataFromDB, indexFromDB) => {
                if (dataFromSmartContract.id === dataFromDB.nft_id) {
                  dataFromSmartContract.status = dataFromDB.status;
                }
                if (
                  response.length - 1 === indexFromSmartContract &&
                  result.listNFT.length - 1 === indexFromDB
                ) {
                  return res.json({
                    data: response,
                    status: "success",
                  });
                }
              });
            }
          );
        }
      });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
