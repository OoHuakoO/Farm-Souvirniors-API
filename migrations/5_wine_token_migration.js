const WineToken = artifacts.require("WineToken");

module.exports = function (deployer) {
  deployer.deploy(WineToken);
};
