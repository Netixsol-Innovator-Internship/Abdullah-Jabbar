// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title TestBTC
 * @dev Test token for DEX trading (simulates Bitcoin)
 */
contract TestBTC is ERC20 {
    constructor() ERC20("Test Bitcoin", "TBTC") {
        _mint(msg.sender, 1_000_000 * 10 ** 18); // 1 million tokens
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
