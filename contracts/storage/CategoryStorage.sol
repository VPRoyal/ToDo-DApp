// storage/CategoryStorage.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "../interfaces/ICategoryStorage.sol";
import "../interfaces/ITypes.sol";

/// @title CategoryStorage
/// @notice Upgrade-safe category persistence layer
contract CategoryStorage is Initializable, UUPSUpgradeable, OwnableUpgradeable, ICategoryStorage {
    uint256 private _categoryIds;
    mapping(uint256 => ITypes.Category) private categories;
    mapping(address => uint256[]) private userCategories;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        _categoryIds = 0;
    }
    function _authorizeUpgrade(address) internal override onlyOwner {}

    function storeCategory(ITypes.Category memory category) external override returns (uint256) {
        _categoryIds++;
        category.id = _categoryIds;
        categories[_categoryIds] = category;
        userCategories[category.owner].push(_categoryIds);
        return _categoryIds;
    }

    function getCategory(uint256 categoryId) external view override returns (ITypes.Category memory) {
        return categories[categoryId];
    }

    function getUserCategories(address user) external view override returns (uint256[] memory){
        return userCategories[user];
    }

    function exists(uint256 categoryId) external view override returns (bool) {
        return categories[categoryId].id != 0;
    }
}

// contract CategoryStorage is Initializable, ICategoryStorage {

//     uint256 private _categoryIds;
    
//     mapping(uint256 => ITypes.Category) private categories;
//     mapping(address => uint256[]) private userCategories;

//     function initialize() public initializer {
//         _categoryIds++; // Start from 1
//     }

//     function storeCategory(ITypes.Category memory category) external override returns (uint256) {
//         _categoryIds++;
//         uint256 newCategoryId = _categoryIds;
        
//         category.id = newCategoryId;
//         categories[newCategoryId] = category;
//         userCategories[category.owner].push(newCategoryId);
        
//         return newCategoryId;
//     }

//     function getCategory(uint256 categoryId) external view override returns (ITypes.Category memory) {
//         return categories[categoryId];
//     }

//     function getUserCategories(address user) external view override returns (uint256[] memory) {
//         return userCategories[user];
//     }
// }