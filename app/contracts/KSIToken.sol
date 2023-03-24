// contracts/KSIToken.sol
// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";

contract KSIToken is ERC20 {
  address public owner;

  constructor() ERC20("KSIToken", "KSI") {
    owner = msg.sender;
    _mint(owner, 100000000 * (10 ** decimals()));
  }

  modifier onlyOwner {
    require(msg.sender == owner);
    _;
  }
}