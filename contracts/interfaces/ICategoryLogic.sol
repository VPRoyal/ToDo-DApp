// interfaces/ICategoryStorage.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./ITypes.sol";

interface ICategoryLogic {
    function createCategory(
        address owner,
        string memory name,
        string memory color
    ) external returns (uint256);

    function getUserCategories(address user) external view returns (ITypes.Category[] memory);
}

// interface ICategoryStorage {
//     function storeCategory(ITodoList.Category memory category) external returns (uint256);
//     function getCategory(uint256 categoryId) external view returns (ITodoList.Category memory);
//     function getUserCategories(address user) external view returns (uint256[] memory);
// }