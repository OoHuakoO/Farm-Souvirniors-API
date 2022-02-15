const express = require("express");
const User = require("../models/user");
const router = express.Router();
const { getDetailNFT, getOwnerNft } = require("../blockchain");

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

router.get("/get-owner-nft/:address", async (req, res) => {
  try {
    const address = req.params.address;
    const response = await getOwnerNft(address);
    if (!response) {
      return res.json({
        data: [],
        status: "success",
      });
    } else {
      User.findOne({ address_wallet: address })
        .populate("listNFT")
        .exec(async (error, result) => {
          if (error) {
            console.log(error);
          } else {
            await response.map(
              async (dataFromSmartContract, indexFromSmartContract) => {
                await result.listNFT.map((dataFromDB, indexFromDB) => {
                  if (dataFromSmartContract.nft_id === dataFromDB.nft_id) {
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
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
