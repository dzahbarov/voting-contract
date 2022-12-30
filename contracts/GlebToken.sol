// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract GlebToken is ERC20Votes {
    constructor() ERC20("GlebToken", "GLB") ERC20Permit("GlebToken") {
        _mint(msg.sender, 100 * 10 ** decimals());
    }

    function decimals() public view virtual override returns (uint8) {
        return 6;
    }
}