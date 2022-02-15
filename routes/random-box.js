const express = require("express");
const User = require("../models/user");
const router = express.Router();
const { getDetailNFT, getOwnerNft } = require("../blockchain");



module.exports = router;
