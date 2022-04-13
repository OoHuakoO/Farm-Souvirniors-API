const express = require("express");
const Info_nft = require("../models/info_nft");
const Owner_nft = require("../models/ownerNFT");
const User = require("../models/user");
const router = express.Router();
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
  console.log("harvest-nft route");
  console.log("address_wallet", address_wallet);
  console.log("nft_id", nft_id);
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
                  status: "not_plant",
                  timeFeed: null,
                  position_plant: null,
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
                  } else if (data.type === "vegetable") {
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
  console.log("feed-nft route");
  console.log("address_wallet", address_wallet);
  console.log("nft_id", nft_id);
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
                          data: {
                            cooldownTime: 60,
                          },
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
  const { address_wallet, nft_id, position_plant } = req.body;
  console.log("plant-nft route");
  console.log("address_wallet", address_wallet);
  console.log("nft_id", nft_id);
  console.log("position_plant", position_plant);
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
                position_plant: position_plant,
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
                        data: {
                          cooldownTime: 60,
                        },
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

router.post("/check-resource", async (req, res) => {
  try {
    const { cost, address_wallet } = req.body;
    User.findOne({ address_wallet: address_wallet }, async (err, result) => {
      if (err) {
        console.log(err);
      }
      if (
        result.resource.wood < cost.wood ||
        result.resource.fruit < cost.fruit
      ) {
        res.json({
          data: "please add resource",
          status: "false",
        });
      } else {
        res.json({
          data: "have enough resource",
          status: "success",
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/craft-nft", async (req, res) => {
  try {
    const {
      pid,
      name,
      picture,
      reward,
      type,
      cost,
      energy_consumed,
      amount_food,
      address_wallet,
    } = req.body;
    const owner_nft = new Owner_nft({
      address_wallet: address_wallet,
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
                    "resource.fruit": result.resource.fruit - cost.fruit,
                    "resource.wood": result.resource.wood - cost.wood,
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
                  let cooldownTime = moment(dataFromDB.timeFeed).diff(
                    Date.now(),
                    "seconds"
                  );
                  if (dataFromDB.position_plant) {
                    newListNFT.push({
                      nft_id: dataFromDB.nft_id,
                      name: dataFromDB.name,
                      picture: dataFromDB.picture,
                      type: dataFromDB.type,
                      status: dataFromDB.status,
                      position_plant: dataFromDB.position_plant,
                      cooldownTime: cooldownTime,
                    });
                  } else {
                    newListNFT.push({
                      nft_id: dataFromDB.nft_id,
                      name: dataFromDB.name,
                      picture: dataFromDB.picture,
                      type: dataFromDB.type,
                      status: dataFromDB.status,
                      cooldownTime: cooldownTime,
                    });
                  }
                } else if (
                  dataFromDB.timeHarvest &&
                  !dataFromDB.timeFeed &&
                  moment(dataFromDB.timeHarvest).format() > moment().format()
                ) {
                  let cooldownTime = moment(dataFromDB.timeHarvest).diff(
                    Date.now(),
                    "seconds"
                  );
                  if (dataFromDB.position_plant) {
                    newListNFT.push({
                      nft_id: dataFromDB.nft_id,
                      name: dataFromDB.name,
                      picture: dataFromDB.picture,
                      type: dataFromDB.type,
                      status: dataFromDB.status,
                      position_plant: dataFromDB.position_plant,
                      cooldownTime: cooldownTime,
                    });
                  } else {
                    newListNFT.push({
                      nft_id: dataFromDB.nft_id,
                      name: dataFromDB.name,
                      picture: dataFromDB.picture,
                      type: dataFromDB.type,
                      status: dataFromDB.status,
                      cooldownTime: cooldownTime,
                    });
                  }
                } else if (
                  dataFromDB.timeHarvest &&
                  !dataFromDB.timeFeed &&
                  moment(dataFromDB.timeHarvest).format() < moment().format()
                ) {
                  if (dataFromDB.position_plant) {
                    newListNFT.push({
                      nft_id: dataFromDB.nft_id,
                      name: dataFromDB.name,
                      picture: dataFromDB.picture,
                      type: dataFromDB.type,
                      status: dataFromDB.status,
                      position_plant: dataFromDB.position_plant,
                      cooldownTime: 0,
                    });
                  } else {
                    newListNFT.push({
                      nft_id: dataFromDB.nft_id,
                      name: dataFromDB.name,
                      picture: dataFromDB.picture,
                      type: dataFromDB.type,
                      status: dataFromDB.status,
                      cooldownTime: 0,
                    });
                  }
                } else if (
                  dataFromDB.timeFeed &&
                  moment(dataFromDB.timeFeed).format() < moment().format()
                ) {
                  if (dataFromDB.position_plant) {
                    newListNFT.push({
                      nft_id: dataFromDB.nft_id,
                      name: dataFromDB.name,
                      picture: dataFromDB.picture,
                      type: dataFromDB.type,
                      status: dataFromDB.status,
                      position_plant: dataFromDB.position_plant,
                      cooldownTime: 0,
                    });
                  } else {
                    newListNFT.push({
                      nft_id: dataFromDB.nft_id,
                      name: dataFromDB.name,
                      picture: dataFromDB.picture,
                      type: dataFromDB.type,
                      status: dataFromDB.status,
                      cooldownTime: 0,
                    });
                  }
                } else {
                  if (dataFromDB.position_plant) {
                    newListNFT.push({
                      nft_id: dataFromDB.nft_id,
                      name: dataFromDB.name,
                      picture: dataFromDB.picture,
                      type: dataFromDB.type,
                      status: dataFromDB.status,
                      position_plant: dataFromDB.position_plant,
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
