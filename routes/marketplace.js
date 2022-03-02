const express = require("express");
const Owner_nft = require("../models/ownerNFT");
const User = require("../models/user");
const router = express.Router();

router.post("/buy-nft", async (req, res) => {
  try {
    const { buyer_address_wallet, seller_address_wallet, nft_id } = req.body;
    Owner_nft.updateMany(
      { nft_id: nft_id },
      {
        $set: {
          status: "not_plant",
          price: 0,
        },
      },
      (err) => {
        if (err) {
          console.log(err);
        } else {
          Owner_nft.findOne({ nft_id: nft_id }, (err, dataFromOwner) => {
            if (err) {
              console.log(err);
            } else {
              User.findOne(
                { address_wallet: seller_address_wallet },
                (err, dataFromSellerAddress) => {
                  if (err) {
                    console.log(err);
                  } else {
                    dataFromSellerAddress.listNFT.pull({
                      _id: dataFromOwner._id,
                    });
                    dataFromSellerAddress.save((err) => {
                      if (err) {
                        console.log(err);
                      } else {
                        User.findOne(
                          { address_wallet: buyer_address_wallet },
                          (err, dataFromBuyerAddress) => {
                            if (err) {
                              console.log(err);
                            } else {
                              dataFromBuyerAddress.listNFT.push(dataFromOwner);
                              dataFromBuyerAddress.save((err) => {
                                if (err) {
                                  console.log(err);
                                } else {
                                  res.json({
                                    data: "buy nft successfully",
                                    status: "success",
                                  });
                                }
                              });
                            }
                          }
                        );
                      }
                    });
                  }
                }
              );
            }
          });
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
});

router.post("/sell-nft", async (req, res) => {
  try {
    const { price, nft_id } = req.body;
    Owner_nft.updateMany(
      { nft_id: nft_id },
      {
        $set: {
          status: "on-marketplace",
          price: price,
        },
      },
      (err) => {
        if (err) {
          console.log(err);
        } else {
          res.json({
            data: "sell nft successfully",
            status: "success",
          });
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
});

router.post("/cancle-nft", async (req, res) => {
  try {
    const { nft_id } = req.body;
    Owner_nft.updateMany(
      { nft_id: nft_id },
      {
        $set: {
          status: "not_plant",
          price: 0,
        },
      },
      (err) => {
        if (err) {
          console.log(err);
        } else {
          res.json({
            data: "cancle nft successfully",
            status: "success",
          });
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
});



module.exports = router;
