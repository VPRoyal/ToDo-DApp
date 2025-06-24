// storage/TaskStorage.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "../interfaces/ITaskStorage.sol";
import "../interfaces/ITodoList.sol";

contract TaskStorage is Initializable, ITaskStorage {

    uint256 private _taskIds;
    
    mapping(uint256 => ITodoList.Task) private tasks;
    mapping(address => uint256[]) private userTasks;

    function initialize() public initializer {
        _taskIds++; // Start from 1
    }

    function storeTask(ITodoList.Task memory task) external override returns (uint256) {
        _taskIds++;
        uint256 newTaskId = _taskIds;
        
        task.id = newTaskId;
        tasks[newTaskId] = task;
        userTasks[task.owner].push(newTaskId);
        
        return newTaskId;
    }

    function getTask(uint256 taskId) external view override returns (ITodoList.Task memory) {
        return tasks[taskId];
    }

    function updateTask(uint256 taskId, ITodoList.Task memory task) external override {
        require(tasks[taskId].id != 0, "Task does not exist");
        tasks[taskId] = task;
    }

    function deleteTask(uint256 taskId) external override {
        require(tasks[taskId].id != 0, "Task does not exist");
        tasks[taskId].isDeleted = true;
    }

    function getUserTasks(address user) external view override returns (uint256[] memory) {
        return userTasks[user];
    }
}