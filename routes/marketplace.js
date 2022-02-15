const express = require("express");
const Owner_nft = require("../models/ownerNFT");
const User = require("../models/user");
const router = express.Router();
const {
  getOwnerNft,
  sellNFT,
  getContractAddress,
  buyNFT,
  cancleNFT,
} = require("../blockchain");

router.post("/buy-nft", async (req, res) => {
  try {
    const {
      buyer_address_wallet,
      seller_address_wallet,
      indexNFT,
      price,
      nft_id,
    } = req.body;
    await buyNFT(buyer_address_wallet, seller_address_wallet, indexNFT, price)
      .then(() => {
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
                                  dataFromBuyerAddress.listNFT.push(
                                    dataFromOwner
                                  );
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
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
});

router.post("/sell-nft", async (req, res) => {
  try {
    const { address_wallet, indexNFT, price, nft_id } = req.body;
    await sellNFT(address_wallet, indexNFT, price)
      .then(() => {
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
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
});

router.post("/cancle-nft", async (req, res) => {
  try {
    const { address_wallet, indexNFT, nft_id } = req.body;
    await cancleNFT(address_wallet, indexNFT)
      .then(() => {
        Owner_nft.updateMany(
          { nft_id: nft_id },
          {
            $set: {
              status: "not-plant",
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
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
});

router.get("/get-nft-martketplace/:address_wallet", async (req, res) => {
  try {
    const { address_wallet } = req.params;
    const contractAddress = await getContractAddress();
    const response = await getOwnerNft(contractAddress);
    const listOwnerNFT = [];
    if (response) {
      response.map((data, index) => {
        if (data.seller !== address_wallet) {
          listOwnerNFT.push(data);
        }
        if (response.length - 1 === index) {
          return res.json({
            data: listOwnerNFT,
            status: "success",
          });
        }
      });
    } else {
      return res.json({
        data: listOwnerNFT,
        status: "success",
      });
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/get-my-sell-nft/:address_wallet", async (req, res) => {
  try {
    const { address_wallet } = req.params;
    const contractAddress = await getContractAddress();
    const response = await getOwnerNft(contractAddress);
    const listOwnerNFT = [];
    if (response) {
      response.map((data, index) => {
        if (data.seller === address_wallet) {
          listOwnerNFT.push(data);
        }
        if (response.length - 1 === index) {
          return res.json({
            data: listOwnerNFT,
            status: "success",
          });
        }
      });
    } else {
      return res.json({
        data: listOwnerNFT,
        status: "success",
      });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
