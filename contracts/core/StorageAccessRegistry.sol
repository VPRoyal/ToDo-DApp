// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

/// @title StorageAccessRegistry
/// @notice Upgradeable registry to resolve and control access to key contracts
contract StorageAccessRegistry is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    mapping(bytes32 => address) private registry;

    event ContractRegistered(string label, bytes32 indexed key, address indexed contractAddress);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}

    /// @notice Registers or updates a contract address under a specific key
    function setContract(string memory label, address contractAddr) external onlyOwner {
        require(contractAddr != address(0), "Zero address not allowed");
        bytes32 key = toKey(label);
        registry[key] = contractAddr;
        emit ContractRegistered(label,key, contractAddr);
    }

    /// @notice Returns a registered contract address by key
    function getContract(string memory label) external view returns (address) {
        bytes32 key = toKey(label);
        return registry[key];
    }

    /// @notice Returns whether a key is set
    function exists(bytes32 key) external view returns (bool) {
        return registry[key] != address(0);
    }

    /// @notice Helper to convert string to bytes32 key
    function toKey(string memory label) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(label));
    }
}
