// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// ---------- IStorageAccessRegistry.sol ----------
interface IStorageAccessRegistry {
    function setContract(string memory label, address contractAddr) external;
    function getContract(string memory label) external view returns (address);
    function exists(bytes32 key) external view returns (bool);
}