// libraries/CategoryLib.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../interfaces/ITodoList.sol";

library CategoryLib {
    function createCategoryStruct(
        uint256 id,
        string memory name,
        string memory color,
        address owner
    ) internal pure returns (ITodoList.Category memory) {
        return ITodoList.Category({
            id: id,
            name: name,
            color: color,
            owner: owner
        });
    }

    function validateCategoryName(string memory name) internal pure returns (bool) {
        require(bytes(name).length > 0 && bytes(name).length <= 50, "Invalid category name length");
        return true;
    }
}