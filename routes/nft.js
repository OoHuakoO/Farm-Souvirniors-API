const express = require("express");
const Info_nft = require("../models/info_nft");
const Owner_nft = require("../models/ownerNFT");
const User = require("../models/user");
const router = express.Router();
const { craftNFT, getDetailNFT, getOwnerNft } = require("../blockchain");
const moment = require("moment");
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

router.post("/feed-nft", async (req, res) => {
  const { address_wallet, nft_id } = req.body;
  const dateHarvest = moment().add(10, "minutes");
  Owner_nft.findOne({ nft_id: nft_id }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      if (
        data.timeFeed &&
        data.timeFeed <= moment() &&
        moment
          .utc(
            moment
              .duration(moment(data.timeFeed).diff(Date.now()), "m")
              .asMinutes()
          )
          .format("mm:ss") === "00.00"
      ) {
        User.findOne({ address_wallet: address_wallet }, (err, result) => {
          if (err) {
            console.log(err);
          } else if (
            result.energy < data.energy_consumed ||
            result.resource.fruit < data.cost.fruit
          ) {
            res.json({
              data: "please add energy or add resource",
              status: "false",
            });
          } else {
            Owner_nft.updateMany(
              {
                nft_id: nft_id,
              },
              {
                $set: {
                  timeHarvest: dateHarvest,
                  status: "wait_harvest",
                  timeFeed: null,
                },
              },
              async (err) => {
                if (err) {
                  console.log(err);
                } else {
                  User.updateMany(
                    { address_wallet: address_wallet },
                    {
                      $set: {
                        energy: result.energy - data.energy_consumed,
                        "resource.fruit":
                          result.resource.fruit - data.cost.fruit,
                      },
                    },
                    (err) => {
                      if (err) {
                        console.log(err);
                      } else {
                        res.json({
                          data: "10.00",
                          status: "success",
                        });
                      }
                    }
                  );
                }
              }
            );
          }
        });
      } else {
        res.json({
          data: "waiting for cooldowntime",
          status: "false",
        });
      }
    }
  });
});

router.post("/plant-nft", async (req, res) => {
  const { address_wallet, nft_id } = req.body;
  const datePlant = moment().add(10, "minutes");
  Owner_nft.findOne({ nft_id: nft_id }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      User.findOne({ address_wallet: address_wallet }, (err, result) => {
        if (err) {
          console.log(err);
        } else if (result.energy < data.energy_consumed) {
          res.json({ data: "please add energy", status: "false" });
        } else {
          Owner_nft.updateMany(
            {
              nft_id: nft_id,
            },
            {
              $set: {
                timeFeed: datePlant,
                status: "wait_feed",
              },
            },
            async (err) => {
              if (err) {
                console.log(err);
              } else {
                User.updateMany(
                  { address_wallet: address_wallet },
                  {
                    $set: {
                      energy: result.energy - data.energy_consumed,
                    },
                  },
                  (err) => {
                    if (err) {
                      console.log(err);
                    } else {
                      res.json({
                        data: "10.00",
                        status: "success",
                      });
                    }
                  }
                );
              }
            }
          );
        }
      });
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
                result.resource.wood < data.cost.wood
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
                      status: "not_plant",
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
                  dataFromSmartContract.timeFeed = dataFromDB.timeFeed;
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

router.get("/game/get-owner-nft/:address", async (req, res) => {
  try {
    const address = req.params.address;
    const newListNFT = [];
    await User.findOne({ address_wallet: address })
      .populate("listNFT")
      .exec(async (error, result) => {
        if (error) {
          console.log(error);
        } else {
          result.listNFT.map((dataFromDB, indexFromDB) => {
            if (dataFromDB.timeFeed && dataFromDB.timeFeed > moment()) {
              newListNFT.push({
                nft_id: dataFromDB.nft_id,
                name: dataFromDB.name,
                type: dataFromDB.type,
                status: dataFromDB.status,
                cooldownFeedTime: moment
                  .utc(
                    moment
                      .duration(
                        moment(dataFromDB.timeFeed).diff(Date.now()),
                        "m"
                      )
                      .asMinutes()
                  )
                  .format("mm:ss"),
              });
            } else if (dataFromDB.timeFeed && dataFromDB.timeFeed < moment()) {
              newListNFT.push({
                nft_id: dataFromDB.nft_id,
                name: dataFromDB.name,
                type: dataFromDB.type,
                status: dataFromDB.status,
                cooldownFeedTime: "00.00",
              });
            } else {
              newListNFT.push({
                nft_id: dataFromDB.nft_id,
                name: dataFromDB.name,
                type: dataFromDB.type,
                status: dataFromDB.status,
              });
            }
            if (result.listNFT.length - 1 === indexFromDB) {
              return res.json({
                data: newListNFT,
                status: "success",
              });
            }
          });
        }
      });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
