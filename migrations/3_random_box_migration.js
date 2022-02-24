const RandomBox = artifacts.require("RandomBox");

module.exports = function (deployer) {
  deployer.deploy(RandomBox);
};
