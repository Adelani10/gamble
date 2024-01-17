// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

error Gamble__InsufficientFunds();
error Gamble__NotOwner();
error Gamble__ZeroOdds();
error Gamble__FailedToSend();

contract Gamble {
    uint public odds;
    address private immutable i_owner;
    mapping(address => uint256) public playerToAmountStaked;

    constructor() {
        i_owner = msg.sender;
    }

    modifier onlyOwner() {
        if (msg.sender != i_owner) {
            revert Gamble__NotOwner();
        }
        _;
    }

    event playerStaked(address indexed player, uint256 indexed amtStaked);

    function placeBet() public payable {
        if (msg.value <= 0) {
            revert Gamble__InsufficientFunds();
        }
        playerToAmountStaked[msg.sender] = msg.value;
        emit playerStaked(msg.sender, playerToAmountStaked[msg.sender]);
    }

    function setOdds(uint256 value) public {
        if(value == 0) {
            revert Gamble__ZeroOdds();
        }
        odds = value;
    }

    function withdraw() public onlyOwner {
        uint256 payOut = playerToAmountStaked[msg.sender] * odds;
        playerToAmountStaked[msg.sender] = 0;

        (bool success,) = payable(i_owner).call{value: payOut}("");
        if(!success){
            revert Gamble__FailedToSend();
        }

    }
}
