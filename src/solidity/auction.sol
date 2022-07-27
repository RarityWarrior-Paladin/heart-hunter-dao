// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";


interface IERC721 {
    function ownerOf(uint256 tokenId) external view returns (address owner);
    function setApprovalForAll(address operator, bool approved) external;

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;
}

contract LoveLovesAuction is Ownable, ERC721Holder {

    mapping(address => uint256) public biderBurns;
    address[] public biders;

    bool public isOpen = false;
    uint256 public totalBurned = 0;

    IERC721 loveLoves;

    address targetAddress = 0x000000000000000000000000000000000000dEaD;

    constructor(address nftAddress) {
        loveLoves = IERC721(nftAddress);
    }

    function bid(uint256[] calldata ids) public {
        require(isOpen, "not start");
        require(ids.length > 0, "need love");

        if(biderBurns[msg.sender] == 0) {
          biders.push(msg.sender);
        }

        biderBurns[msg.sender] += ids.length;
        totalBurned += ids.length;

        for (uint i=0; i< ids.length; i++) {
            loveLoves.transferFrom(
                msg.sender, targetAddress, ids[i]
            );
        }
    }

    function toggleOpen() public onlyOwner {
        isOpen = !isOpen;
    }

    function setTarget(address newTarget) public onlyOwner {
        targetAddress = newTarget;
    }

    function totalBider() public view returns (uint256) {
        return biders.length;
    }

    function page(uint256 pageIndex, uint256 pageSize) public view returns (address[] memory list) {
        uint256 start = pageIndex * pageSize;
        uint256 end = _min(start + pageSize, biders.length);
        for (uint i = 0; i < end ; i++) {
            list[i] = biders[start + i];
        }
    }

    function _min(uint a, uint b) internal pure returns (uint) {
      return a >= b ? b : a;
    }
}