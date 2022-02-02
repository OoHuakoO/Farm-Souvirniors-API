const fs = require("fs");
const path = require("path");
const Web3 = require("web3");
const TruffleContract = require("@truffle/contract");
const web3Provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
let NFT;
const createContractInstance = async (artifactName) => {
  const artifact = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "../build/contracts", `${artifactName}.json`)
    )
  );
  const contract = TruffleContract(artifact);
  contract.setProvider(web3Provider);
  return contract.deployed();
};
createContractInstance("NFT").then((instance) => {
  NFT = instance;
});

const craftNFT = async (
  pid,
  name,
  reward,
  type_nft,
  cost_wood,
  cost_fruit,
  energyConsumed
) => {
  await NFT._craftNFT(
    pid,
    name,
    reward,
    type_nft,
    cost_wood,
    cost_fruit,
    energyConsumed,
    { from: "0x0d2Ee3b5CF008D5976BC5B67d01E953b2e986EA1", gas: 1000000 }
  );
  return { status: "success" };
};

const getDetailNFT = async (pid) => {
  const {
    name,
    reward,
    type_nft,
    price,
    cost_wood,
    cost_fruit,
    energyConsumed,
  } = await NFT.nft.call(pid);
  return {
    data: {
      name,
      reward: reward.toString(),
      type_nft,
      price: price.toString(),
      cost_wood: cost_wood.toString(),
      cost_fruit: cost_fruit.toString(),
      energyConsumed: energyConsumed.toString(),
    },
  };
};
const getOwnerNft = async (address) => {
  let jsonOnwerNFT = [];
  const listOwnerNFT = await NFT.getNFTByOwner.call(address);
  for (const [index, id] of listOwnerNFT.entries()) {
    await getDetailNFT(id.toString()).then((data) => {
      jsonOnwerNFT.push({ ...data.data, id: id.toString() });
    });
    if (index === listOwnerNFT.length - 1) {
      return jsonOnwerNFT;
    }
  }
};
module.exports = { craftNFT, getDetailNFT, getOwnerNft };
