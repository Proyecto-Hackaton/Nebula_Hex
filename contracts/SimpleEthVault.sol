// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/v5.0.2/contracts/token/ERC20/ERC20.sol";
import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/v5.0.2/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/v5.0.2/contracts/utils/ReentrancyGuard.sol";

contract SimpleEthVault is ERC20, ERC20Burnable, ReentrancyGuard {
    constructor() ERC20("Vault Ethereum", "vETH") {}

    function depositEth() public payable nonReentrant {
        require(msg.value > 0, "Amount must be > 0");
        _mint(msg.sender, msg.value);
    }

    function withdrawEth(uint256 amount) public nonReentrant {
        require(amount > 0, "Amount must be > 0");
        _burn(msg.sender, amount);
        (bool ok, ) = msg.sender.call{value: amount}("");
        require(ok, "ETH transfer failed");
    }

    receive() external payable {}
}