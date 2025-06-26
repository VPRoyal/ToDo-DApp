// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./ITypes.sol";

/// @title ICategoryStorage
/// @notice Interface for category data persistence
interface ICategoryStorage {
    function storeCategory(ITypes.Category memory category) external returns (uint256);
    function getCategory(uint256 categoryId) external view returns (ITypes.Category memory);
    function getUserCategories(address user) external view returns (uint256[] memory);
    function exists(uint256 categoryId) external view returns (bool);
}
