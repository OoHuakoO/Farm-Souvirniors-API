// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract RandomBox {
    address public owner;
    struct info_randomBox {
        string name;
        string price;
        uint16 count;
        string picture;
    }
    struct info_owner_randomBox {
        uint256 nft_id;
        string name;
        string picture;
        string type_nft;
    }

    constructor() {
        owner = msg.sender;
    }

    mapping(uint256 => address) public randomBoxToContractAddress;
    mapping(address => uint256) public ContractAddressRandomBoxCount;
    mapping(uint256 => address) public ownerRandomBox;
    mapping(address => uint256) public ownerRandomBoxCount;
    info_randomBox[] public box;
    info_owner_randomBox[] public owner_box;
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
        owner_box.push(info_owner_randomBox(_nft_id, _name, _picture, "chest"));
        uint256 id = owner_box.length - 1;
        ownerRandomBox[id] = msg.sender;
        ownerRandomBoxCount[msg.sender] = ownerRandomBoxCount[msg.sender] + 1;
        info_randomBox storage randomBox = box[_indexRandomBox];
        randomBox.count = randomBox.count - 1;
        payable(owner).transfer(msg.value);
    }

    function _getOwnerRandomBox(address _owner)
        public
        view
        returns (uint256[] memory)
    {
        uint256[] memory result = new uint256[](ownerRandomBoxCount[_owner]);
        uint256 counter = 0;
        for (uint256 i = 0; i < owner_box.length; i++) {
            if (ownerRandomBox[i] == _owner) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }
    
    // function _sellOnwerRandomBox(
    //     uint256 _nft_id,
    //     uint256 _indexRandomBox,
    //     string memory _name,
    //     string memory _picture
    // ) public payable {
    //     onwer_box.push(
    //         info_owner_randomBox(_nft_id, _name, _picture, address(0))
    //     );
    //     uint256 id = onwer_box.length - 1;
    //     ownerRandomBox[id] = msg.sender;
    //     ownerRandomBoxCount[msg.sender] = ownerRandomBoxCount[msg.sender] + 1;
    //     info_randomBox storage randomBox = box[_indexRandomBox];
    //     randomBox.count = randomBox.count - 1;
    //     payable(owner).transfer(msg.value);
    // }
}
