// contracts/KSIGame.sol
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

interface IERC20 {
  function transfer(address to, uint256 amount) external returns (bool);
}

contract KSIGame {
  address public owner;
  event Status(string msg, address user, bool winner);

  constructor() {
    owner = msg.sender;
  }

  function randomNumber() public view returns (uint) {
    return uint(keccak256(abi.encodePacked(owner, block.timestamp)));
  }

  function enter(uint256 amount) public payable {
    uint result = randomNumber() % 2;
      
    if (result == 0) {
      payable(msg.sender).transfer(amount * 2);
      emit Status('You won :-)', msg.sender, true);
    } else {
      emit Status('You lost :-(', msg.sender, false);
    }
  }

  receive() external payable {
    if (msg.sender != owner) {
      enter(msg.value);
    }
  }
}