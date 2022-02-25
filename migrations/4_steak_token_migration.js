const SteakToken = artifacts.require("SteakToken");

module.exports = function (deployer) {
  deployer.deploy(SteakToken);
};
