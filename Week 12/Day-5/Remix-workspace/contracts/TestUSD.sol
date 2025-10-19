// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title TestUSD
 * @dev Test token for DEX trading (simulates stablecoin)
 */
contract TestUSD is ERC20 {
    constructor() ERC20("Test USD", "TUSD") {
        _mint(msg.sender, 10_000_000 * 10 ** 18); // 10 million tokens
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
