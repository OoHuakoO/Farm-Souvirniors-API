const fs = require("fs");
const path = require("path");
const Web3 = require("web3");
const TruffleContract = require("@truffle/contract");
const HDWallet = require("@truffle/hdwallet-provider");
let NFT;
// Development
const web3 = new Web3("http://127.0.0.1:7545");
// Testnet Ropsten
// const web3 = new Web3(
//   new HDWallet(
//     "pen luxury three helmet switch crime music thunder casual move owner dolphin",
//     "https://ropsten.infura.io/v3/b0f95459c5a149cc9032a56d32fd1bdf"
//   )
// );
// Testnet BSC
// const web3 = new Web3(
//   new HDWallet(
//     "pen luxury three helmet switch crime music thunder casual move owner dolphin",
//     "https://data-seed-prebsc-1-s1.binance.org:8545"
//   )
// );

// const createContractInstance = async (artifactName) => {
//   const artifact = JSON.parse(
//     fs.readFileSync(
//       path.join(__dirname, "../build/contracts", `${artifactName}.json`)
//     )
//   );
//   const contract = TruffleContract(artifact);
//   contract.setProvider(web3Provider);
//   return contract.deployed();
// };
// createContractInstance("NFT").then((instance) => {
//   NFT = instance;
// console.log(instance)
// });

const createContractInstance = async () => {
  const artifact = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../build/contracts", "NFT.json"))
  );
  const netId = await web3.eth.net.getId();
  const deployNetwork = artifact.networks[netId];
  NFT = new web3.eth.Contract(
    artifact.abi,
    deployNetwork && deployNetwork.address
  );
};
createContractInstance();

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
  address_wallet
) => {
  await NFT.methods
    ._craftNFT(
      pid,
      name,
      picture,
      reward,
      type_nft,
      cost_wood,
      cost_fruit,
      energy_consumed,
      amount_food
    )
    .send({ from: address_wallet, gas: 3000000 });
  return { status: "success" };
};

const getDetailNFT = async (pid) => {
  const {
    nft_id,
    name,
    picture,
    reward,
    type_nft,
    price,
    cost_wood,
    cost_fruit,
    energy_consumed,
    amount_food,
    seller,
  } = await NFT.methods.nft(pid).call();
  return {
    data: {
      nft_id: nft_id.toString(),
      name: name.toString(),
      picture: picture.toString(),
      reward: reward.toString(),
      type_nft: type_nft.toString(),
      price: price.toString(),
      cost_wood: cost_wood.toString(),
      cost_fruit: cost_fruit.toString(),
      energy_consumed: energy_consumed.toString(),
      amount_food: amount_food.toString(),
      seller: seller.toString(),
    },
  };
};
const getOwnerNft = async (address) => {
  let jsonOnwerNFT = [];
  const listOwnerNFT = await NFT.methods.getNFTByOwner(address).call();
  for (const [index, id] of listOwnerNFT.entries()) {
    await getDetailNFT(id.toString()).then((data) => {
      jsonOnwerNFT.push({ ...data.data, tokenID: id.toString() });
    });
    if (index === listOwnerNFT.length - 1) {
      return jsonOnwerNFT;
    }
  }
};

const sellNFT = async (address_wallet, nft_id, price) => {
  await NFT.methods
    .sellNFT(nft_id, price)
    .send({ from: address_wallet, gas: 3000000 });
  return { status: "success" };
};

const buyNFT = async (
  buyer_address_wallet,
  seller_address_wallet,
  nft_id,
  price
) => {
  
  await NFT.methods.buyNFT(nft_id, price,seller_address_wallet).send({
    from: buyer_address_wallet,
    gas: 3000000,
    value: web3.utils.toWei(price, "ether"),
  });
  return { status: "success" };
};

const getContractAddress = async () => {
  return NFT._address;
};
module.exports = {
  craftNFT,
  getDetailNFT,
  getOwnerNft,
  sellNFT,
  buyNFT,
  getContractAddress,
};
