// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// ---------- IStorageAccessRegistry.sol ----------
interface IStorageAccessRegistry {
    function getContract(bytes32 key) external view returns (address);
    function exists(bytes32 key) external view returns (bool);
    function toKey(string memory label) external pure returns (bytes32);
}