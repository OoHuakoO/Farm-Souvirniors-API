// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract NFT {
    struct info_nft {
        uint256 nft_id;
        string name;
        string picture;
        uint16 reward;
        string type_nft;
        uint16 price;
        uint16 cost_wood;
        uint16 cost_fruit;
        uint16 energy_consumed;
        uint16 amount_food;
    }
    mapping(uint256 => address) public ownerNft;
    mapping(address => uint256) ownerNFTCount;
    info_nft[] public nft;

    function _craftNFT(
        uint256 _nft_id,
        string memory _name,
        string memory _picture,
        uint16 _reward,
        string memory _type_nft,
        uint16 _cost_wood,
        uint16 _cost_fruit,
        uint16 _energy_consumed,
        uint16 _amount_food
    ) public {
        nft.push(
            info_nft(
                _nft_id,
                _name,
                _picture,
                _reward,
                _type_nft,
                0,
                _cost_wood,
                _cost_fruit,
                _energy_consumed,
                _amount_food
            )
        );
        uint256 id = nft.length - 1;
        ownerNft[id] = msg.sender;
        ownerNFTCount[msg.sender] = ownerNFTCount[msg.sender] + 1;
    }

    function getNFTByOwner(address _owner)
        public
        view
        returns (uint256[] memory)
    {
        uint256[] memory result = new uint256[](ownerNFTCount[_owner]);
        uint256 counter = 0;
        for (uint256 i = 0; i < nft.length; i++) {
            if (ownerNft[i] == _owner) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }
}
