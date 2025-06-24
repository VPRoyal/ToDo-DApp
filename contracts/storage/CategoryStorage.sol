// storage/CategoryStorage.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "../interfaces/ICategoryStorage.sol";
import "../interfaces/ITodoList.sol";

contract CategoryStorage is Initializable, ICategoryStorage {

    uint256 private _categoryIds;
    
    mapping(uint256 => ITodoList.Category) private categories;
    mapping(address => uint256[]) private userCategories;

    function initialize() public initializer {
        _categoryIds++; // Start from 1
    }

    function storeCategory(ITodoList.Category memory category) external override returns (uint256) {
        _categoryIds++;
        uint256 newCategoryId = _categoryIds;
        
        category.id = newCategoryId;
        categories[newCategoryId] = category;
        userCategories[category.owner].push(newCategoryId);
        
        return newCategoryId;
    }

    function getCategory(uint256 categoryId) external view override returns (ITodoList.Category memory) {
        return categories[categoryId];
    }

    function getUserCategories(address user) external view override returns (uint256[] memory) {
        return userCategories[user];
    }
}