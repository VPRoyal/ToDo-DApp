// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import "../interfaces/ICategoryStorage.sol";
import "../interfaces/IStorageAccessRegistry.sol";
import "../libraries/CategoryLib.sol";
import "../interfaces/ICategoryLogic.sol";
import "../interfaces/ITypes.sol";


contract CategoryLogic is Initializable, UUPSUpgradeable, OwnableUpgradeable, ICategoryLogic{
    IStorageAccessRegistry public registry;

    /// @custom:oz-upgrades-unsafe-allow constructor
constructor() {
    _disableInitializers();
}
    function initialize(address registryAddress) public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        registry = IStorageAccessRegistry(registryAddress);
    }
    function _authorizeUpgrade(address) internal override onlyOwner {}


    function createCategory(
        address owner,
        string memory name,
        string memory color
    ) external returns (uint256) {
        ICategoryStorage categoryStorage = ICategoryStorage(registry.getContract("CATEGORY_STORAGE"));
        CategoryLib.validateCategoryName(name);

        ITypes.Category memory category = CategoryLib.buildCategory(
            0, name, color, owner
        );

        return categoryStorage.storeCategory(category);
    }

    function getUserCategories(address user) external view returns (ITypes.Category[] memory) {
        ICategoryStorage categoryStorage = ICategoryStorage(registry.getContract("CATEGORY_STORAGE"));
        uint256[] memory ids = categoryStorage.getUserCategories(user);
        ITypes.Category[] memory result = new ITypes.Category[](ids.length);

        for (uint256 i = 0; i < ids.length; i++) {
            result[i] = categoryStorage.getCategory(ids[i]);
        }

        return result;
    }
}
