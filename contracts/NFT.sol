// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract NFT {
    struct info_nft {
        string name;
        uint16 reward;
        string type_nft;
        uint16 price;
        uint16 cost_wood;
        uint16 cost_fruit;
        uint16 energy_consumed;
        uint16 amount_food;
    }
    mapping(address => uint256[]) public ownerNft;
    mapping(uint256 => info_nft) public nft;
    mapping(address => uint256) ownerNFTCount;

    function _craftNFT(
        uint256 _pid,
        string memory _name,
        uint16 _reward,
        string memory _type_nft,
        uint16 _cost_wood,
        uint16 _cost_fruit,
        uint16 _energy_consumed,
        uint16 _amount_food
    ) public {
        nft[_pid] = info_nft({
            name: _name,
            reward: _reward,
            type_nft: _type_nft,
            price: 0,
            cost_wood: _cost_wood,
            cost_fruit: _cost_fruit,
            energy_consumed: _energy_consumed,
            amount_food : _amount_food
        });
        ownerNft[msg.sender].push(_pid);
    }

    function getNFTByOwner(address _owner)
        public
        view
        returns (uint256[] memory)
    {
        return ownerNft[_owner];
    }
}
