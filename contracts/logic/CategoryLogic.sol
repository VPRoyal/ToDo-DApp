// logic/CategoryLogic.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "../interfaces/ITodoList.sol";
import "../interfaces/ICategoryStorage.sol";
import "../libraries/CategoryLib.sol";

contract CategoryLogic is Initializable, OwnableUpgradeable {
    ICategoryStorage private _categoryStorage;

    function initialize(address categoryStorage) public initializer {
        __Ownable_init();
        _categoryStorage = ICategoryStorage(categoryStorage);
    }

    function createCategory(
        string memory _name,
        string memory _color
    ) external returns (uint256) {
        CategoryLib.validateCategoryName(_name);

        ITodoList.Category memory newCategory = CategoryLib.createCategoryStruct(
            0,
            _name,
            _color,
            msg.sender
        );

        return _categoryStorage.storeCategory(newCategory);
    }

    function getUserCategories() external view returns (ITodoList.Category[] memory) {
        uint256[] memory categoryIds = _categoryStorage.getUserCategories(msg.sender);
        ITodoList.Category[] memory categories = new ITodoList.Category[](categoryIds.length);

        for (uint256 i = 0; i < categoryIds.length; i++) {
            categories[i] = _categoryStorage.getCategory(categoryIds[i]);
        }

        return categories;
    }
}