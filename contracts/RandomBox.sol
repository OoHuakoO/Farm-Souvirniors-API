// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract RandomBox {
    address public owner;
    struct info_randomBox {
        uint256 nft_id;
        string name;
        uint256 price;
        uint16 count;
        string picture;
    }

    constructor() {
        owner = msg.sender;
    }

    mapping(uint256 => address) public randomBoxToContractAddress;
    mapping(address => uint256) public ContractAddressRandomBoxCount;
    info_randomBox[] public box;

    function _mintRandomBox(
        uint256 _nft_id,
        string memory _name,
        uint256 _price,
        uint8 _count,
        string memory _picture
    ) public {
        require(msg.sender == owner);
        box.push(info_randomBox(_nft_id, _name, _price, _count,_picture));
        uint256 id = box.length - 1;
        randomBoxToContractAddress[id] = address(this);
        ContractAddressRandomBoxCount[address(this)] =
            ContractAddressRandomBoxCount[address(this)] +
            1;
    }

    function _updateCountRandomBox(uint256 _indexRandomBox, uint16 count)
        public
    {
        require(msg.sender == owner);
        info_randomBox storage randomBox = box[_indexRandomBox];
        randomBox.count = randomBox.count + count;
    }
}
