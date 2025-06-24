// interfaces/ITaskStorage.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./ITodoList.sol";

interface ITaskStorage {
    function storeTask(ITodoList.Task memory task) external returns (uint256);
    function getTask(uint256 taskId) external view returns (ITodoList.Task memory);
    function updateTask(uint256 taskId, ITodoList.Task memory task) external;
    function deleteTask(uint256 taskId) external;
    function getUserTasks(address user) external view returns (uint256[] memory);
}