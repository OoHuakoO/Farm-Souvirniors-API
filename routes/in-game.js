const express = require("express");
const Info_nft = require("../models/info_nft");
const Owner_nft = require("../models/ownerNFT");
const User = require("../models/user");
const router = express.Router();
const {
  craftNFT,
} = require("../blockchain");
const moment = require("moment");

router.get("/info-nft", async (req, res) => {
  Info_nft.find({}, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.json({ data: data, status: "success" });
    }
  });
});

router.post("/harvest-nft", async (req, res) => {
  const { address_wallet, nft_id } = req.body;
  Owner_nft.findOne({ nft_id: nft_id }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      if (
        data.timeHarvest &&
        moment(data.timeHarvest).format() <= moment().format()
      ) {
        User.findOne({ address_wallet: address_wallet }, (err, result) => {
          if (err) {
            console.log(err);
          } else if (result.energy < data.energy_consumed) {
            res.json({
              data: "please add energy",
              status: "false",
            });
          } else {
            Owner_nft.updateMany(
              {
                nft_id: nft_id,
              },
              {
                $set: {
                  timeHarvest: null,
                  status: "not_use",
                  timeFeed: null,
                },
              },
              async (err) => {
                if (err) {
                  console.log(err);
                } else {
                  if (data.type === "animal") {
                    User.updateMany(
                      { address_wallet: address_wallet },
                      {
                        $set: {
                          energy: result.energy - data.energy_consumed,
                          "resource.meat": result.resource.meat + data.reward,
                        },
                      },
                      (err) => {
                        if (err) {
                          console.log(err);
                        } else {
                          res.json({
                            data: "harvest successfull",
                            status: "success",
                          });
                        }
                      }
                    );
                  } else if (data.type === "fruit") {
                    User.updateMany(
                      { address_wallet: address_wallet },
                      {
                        $set: {
                          energy: result.energy - data.energy_consumed,
                          "resource.fruit": result.resource.fruit + data.reward,
                        },
                      },
                      (err) => {
                        if (err) {
                          console.log(err);
                        } else {
                          res.json({
                            data: "harvest successfull",
                            status: "success",
                          });
                        }
                      }
                    );
                  } else if (data.type === "vegatable") {
                    User.updateMany(
                      { address_wallet: address_wallet },
                      {
                        $set: {
                          energy: result.energy - data.energy_consumed,
                          "resource.wood": result.resource.wood + data.reward,
                        },
                      },
                      (err) => {
                        if (err) {
                          console.log(err);
                        } else {
                          res.json({
                            data: "harvest successfull",
                            status: "success",
                          });
                        }
                      }
                    );
                  }
                }
              }
            );
          }
        });
      } else {
        res.json({
          data: "waiting for cooldownHarvest",
          status: "false",
        });
      }
    }
  });
});

router.post("/feed-nft", async (req, res) => {
  const { address_wallet, nft_id } = req.body;
  const dateHarvest = moment().add(1, "minutes");
  Owner_nft.findOne({ nft_id: nft_id }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      if (
        data.timeFeed &&
        moment(data.timeFeed).format() <= moment().format()
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
                          data: "01.00",
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
          data: "waiting for cooldownFeed",
          status: "false",
        });
      }
    }
  });
});

router.post("/plant-nft", async (req, res) => {
  const { address_wallet, nft_id } = req.body;
  const datePlant = moment().add(1, "minutes");
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
                        data: "01.00",
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
      picture,
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
                  picture,
                  reward,
                  type,
                  cost.wood,
                  cost.fruit,
                  energy_consumed,
                  amount_food,
                  address_wallet
                )
                  .then(async () => {
                    const owner_nft = new Owner_nft({
                      nft_id: pid,
                      name,
                      picture,
                      reward,
                      type,
                      cost,
                      energy_consumed,
                      amount_food,
                      status: "not_plant",
                      price: 0,
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

router.get("/get-owner-nft/:address", async (req, res) => {
    try {
      const address = req.params.address;
      const newListNFT = [];
      await User.findOne({ address_wallet: address })
        .populate("listNFT")
        .exec(async (error, result) => {
          if (error) {
            console.log(error);
          } else {
            if (result.listNFT.length === 0) {
              return res.json({
                data: [],
                status: "success",
              });
            } else {
              result.listNFT.map((dataFromDB) => {
                if (dataFromDB.status !== "on-marketplace") {
                  if (
                    dataFromDB.timeFeed &&
                    moment(dataFromDB.timeFeed).format() > moment().format()
                  ) {
                    newListNFT.push({
                      nft_id: dataFromDB.nft_id,
                      name: dataFromDB.name,
                      picture: dataFromDB.picture,
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
                  } else if (
                    dataFromDB.timeHarvest &&
                    !dataFromDB.timeFeed &&
                    moment(dataFromDB.timeHarvest).format() > moment().format()
                  ) {
                    newListNFT.push({
                      nft_id: dataFromDB.nft_id,
                      name: dataFromDB.name,
                      picture: dataFromDB.picture,
                      type: dataFromDB.type,
                      status: dataFromDB.status,
                      cooldownHarvestTime: moment
                        .utc(
                          moment
                            .duration(
                              moment(dataFromDB.timeHarvest).diff(Date.now()),
                              "m"
                            )
                            .asMinutes()
                        )
                        .format("mm:ss"),
                    });
                  } else if (
                    dataFromDB.timeHarvest &&
                    !dataFromDB.timeFeed &&
                    moment(dataFromDB.timeHarvest).format() < moment().format()
                  ) {
                    newListNFT.push({
                      nft_id: dataFromDB.nft_id,
                      name: dataFromDB.name,
                      picture: dataFromDB.picture,
                      type: dataFromDB.type,
                      status: dataFromDB.status,
                      cooldownHarvestTime: "00.00",
                    });
                  } else if (
                    dataFromDB.timeFeed &&
                    moment(dataFromDB.timeFeed).format() < moment().format()
                  ) {
                    newListNFT.push({
                      nft_id: dataFromDB.nft_id,
                      name: dataFromDB.name,
                      picture: dataFromDB.picture,
                      type: dataFromDB.type,
                      status: dataFromDB.status,
                      cooldownFeedTime: "00.00",
                    });
                  } else {
                    newListNFT.push({
                      nft_id: dataFromDB.nft_id,
                      name: dataFromDB.name,
                      picture: dataFromDB.picture,
                      type: dataFromDB.type,
                      status: dataFromDB.status,
                    });
                  }
                }
              });
              return res.json({
                data: newListNFT,
                status: "success",
              });
            }
          }
        });
    } catch (err) {
      console.log(err);
    }
  });

module.exports = router;
