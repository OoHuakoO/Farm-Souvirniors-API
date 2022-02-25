const FurnitureToken = artifacts.require("FurnitureToken");

module.exports = function (deployer) {
  deployer.deploy(FurnitureToken);
};
