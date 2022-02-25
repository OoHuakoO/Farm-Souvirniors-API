// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./NFT.sol";

contract RandomBox is NFT {
    address private owner;
    struct info_randomBox {
        string name;
        string price;
        uint16 count;
        string picture;
    }

    constructor() {
        owner = msg.sender;
    }

    event BuyRandomBox(
        address indexed _to,
        string name,
        string picture,
        uint256 indexNFT
    );
    event OpenRandomBox(address indexed from, uint256 indexNFT);
    mapping(uint256 => address) public randomBoxToContractAddress;
    mapping(address => uint256) public ContractAddressRandomBoxCount;
    info_randomBox[] public box;

    modifier is_user() {
        if (msg.sender != owner) _;
    }

    function _mintRandomBox(
        string memory _name,
        string memory _price,
        uint8 _count,
        string memory _picture
    ) public {
        require(msg.sender == owner);
        box.push(info_randomBox(_name, _price, _count, _picture));
        uint256 id = box.length - 1;
        randomBoxToContractAddress[id] = address(this);
        ContractAddressRandomBoxCount[address(this)] =
            ContractAddressRandomBoxCount[address(this)] +
            1;
    }

    function _addCountRandomBox(uint256 _indexRandomBox, uint16 count) public {
        require(msg.sender == owner);
        info_randomBox storage randomBox = box[_indexRandomBox];
        randomBox.count = randomBox.count + count;
    }

    function _getRandomBox() public view returns (uint256[] memory) {
        uint256[] memory result = new uint256[](
            ContractAddressRandomBoxCount[address(this)]
        );
        uint256 counter = 0;
        for (uint256 i = 0; i < box.length; i++) {
            result[counter] = i;
            counter++;
        }
        return result;
    }

    function _buyRandomBox(
        uint256 _nft_id,
        uint256 _indexRandomBox,
        string memory _name,
        string memory _picture
    ) public payable is_user {
        _craftNFT(_nft_id, _name, _picture, 0, "chest", 0, 0, 0, 0);
        uint256 id = nft.length - 1;
        ownerNft[id] = msg.sender;
        ownerNFTCount[msg.sender] = ownerNFTCount[msg.sender] + 1;
        info_randomBox storage randomBox = box[_indexRandomBox];
        randomBox.count = randomBox.count - 1;
        payable(owner).transfer(msg.value);
        emit BuyRandomBox(msg.sender, _name, _picture, id);
    }

    function _openRandomBox(
        uint256 _nft_id,
        string memory _name,
        string memory _picture,
        uint16 _reward,
        string memory _type_nft,
        uint16 _cost_wood,
        uint16 _cost_fruit,
        uint16 _energy_consumed,
        uint16 _amount_food,
        uint256 _indexRandomBox
    ) public is_user {
        ownerNft[_indexRandomBox] = 0x000000000000000000000000000000000000dEaD;
        ownerNFTCount[msg.sender] = ownerNFTCount[msg.sender] - 1;
        _craftNFT(
            _nft_id,
            _name,
            _picture,
            _reward,
            _type_nft,
            _cost_wood,
            _cost_fruit,
            _energy_consumed,
            _amount_food
        );
    }
}
