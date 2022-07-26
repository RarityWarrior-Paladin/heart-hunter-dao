// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";


interface IERC721 {
    function ownerOf(uint256 tokenId) external view returns (address owner);
    function setApprovalForAll(address operator, bool approved) external;

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;
}

struct BidInfo {
    address account;
    uint256 total;
}

contract LoveLovesAuction is Ownable, ERC721Holder {

    mapping(address => uint256) public biders;

    BidInfo[] public biderInfo;

    bool public isOpen = false;
    uint256 public totalBurned = 0;

    IERC721 loveLoves;

    address targetAddress = address(0);

    constructor(address nftAddress) {
        loveLoves = IERC721(nftAddress);
    }

    function bid(uint256[] calldata ids) public {
        require(isOpen, "not start");
        require(ids.length > 0, "need love");

        if(
            biderInfo[biders[msg.sender]].account != msg.sender
        ){
            biders[msg.sender] = biderInfo.length;
            biderInfo.push(
                BidInfo(msg.sender, 0)
            );
        }

        BidInfo storage info = biderInfo[biders[msg.sender]];
        info.total = info.total + ids.length;
        totalBurned = totalBurned + ids.length;

        for (uint i=0; i< ids.length; i++) {
            loveLoves.safeTransferFrom(
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
        return biderInfo.length;
    }

    function page(uint256 pageIndex, uint256 pageSize) public view returns (BidInfo[] memory list) {
        uint256 start = pageIndex * pageSize;
        for (uint i = 0; i<= pageSize ; i++) {
            list[i] = biderInfo[start + i];
        }
        return list;
    }
}