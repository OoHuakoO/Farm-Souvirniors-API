const fs = require("fs");
const path = require("path");
const Web3 = require("web3");
const TruffleContract = require("@truffle/contract");
const HDWallet = require("@truffle/hdwallet-provider");
let NFT;
// Development
const web3Provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
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

// Testnet
// const web3 = new Web3(
//   new HDWallet(
//     "pen luxury three helmet switch crime music thunder casual move owner dolphin",
//     "https://ropsten.infura.io/v3/b0f95459c5a149cc9032a56d32fd1bdf"
//   )
// );

// const createContractInstance = async (artifactName) => {
//   const artifact = JSON.parse(
//     fs.readFileSync(path.join(__dirname, "../build/contracts", "NFT.json"))
//   );
//   const deployNetwork = artifact.networks[3];
//   NFT = new web3.eth.Contract(
//     artifact.abi,
//     deployNetwork && deployNetwork.address
//   );
// };
// createContractInstance();

const craftNFT = async (
  pid,
  name,
  picture,
  reward,
  type_nft,
  cost_wood,
  cost_fruit,
  energy_consumed,
  amount_food,
) => {
  await NFT._craftNFT(
    pid,
    name,
    picture,
    reward,
    type_nft,
    cost_wood,
    cost_fruit,
    energy_consumed,
    amount_food,
    { from: "0x1B7AAdF746c0B06CE987143C3770602e8894FD88", gas: 3000000 }
  );
  return { status: "success" };
};

const getDetailNFT = async (pid) => {
  const {
    name,
    picture,
    reward,
    type_nft,
    price,
    cost_wood,
    cost_fruit,
    energy_consumed,
    amount_food,
  } = await NFT.nft.call(pid);
  return {
    data: {
      name,
      picture: picture.toString(),
      reward: reward.toString(),
      type_nft,
      price: price.toString(),
      cost_wood: cost_wood.toString(),
      cost_fruit: cost_fruit.toString(),
      energy_consumed: energy_consumed.toString(),
      amount_food: amount_food.toString(),
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
