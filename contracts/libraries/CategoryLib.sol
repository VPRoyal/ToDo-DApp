// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../interfaces/ITypes.sol";

/// @title CategoryLib
/// @notice Utility library for creating and validating categories
library CategoryLib {
    function buildCategory(
        uint256 id,
        string memory name,
        string memory color,
        address owner
    ) internal pure returns (ITypes.Category memory) {
        return ITypes.Category({
            id: id,
            name: name,
            color: color,
            owner: owner
        });
    }

    function validateCategoryName(string memory name) internal pure {
        require(bytes(name).length > 0 && bytes(name).length <= 50, "Invalid category name length");
    }
}
