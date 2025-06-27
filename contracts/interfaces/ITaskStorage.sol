// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./ITypes.sol";

/// @title ITaskStorage
/// @notice Interface for task data persistence
interface ITaskStorage {
    event TaskStored(uint256 indexed taskId, address indexed owner);
    function storeTask(ITypes.Task memory task) external returns (uint256);
    function getTask(uint256 taskId) external view returns (ITypes.Task memory);
    function updateTask(uint256 taskId, ITypes.Task memory task) external;
    function getUserTasks(address user) external view returns (uint256[] memory);
    function exists(uint256 taskId) external view returns (bool);
}