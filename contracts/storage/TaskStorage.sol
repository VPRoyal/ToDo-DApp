// storage/TaskStorage.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "../interfaces/ITypes.sol";
import "../interfaces/ITaskStorage.sol";
import "../interfaces/ICategoryStorage.sol";

/// @title TaskStorage
/// @notice Upgrade-safe task persistence layer
contract TaskStorage is Initializable,UUPSUpgradeable, OwnableUpgradeable,ITaskStorage {
    uint256 private _taskIds;
    mapping(uint256 => ITypes.Task) private tasks;
    mapping(address => uint256[]) private userTasks;

 /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }
    function initialize() public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        _taskIds = 0;
    }
    function _authorizeUpgrade(address) internal override onlyOwner {}
    function storeTask(ITypes.Task memory task) external override returns (uint256) {
        _taskIds++;
        task.id = _taskIds;
        tasks[_taskIds] = task;
        userTasks[task.owner].push(_taskIds);
        emit TaskStored(_taskIds, task.owner);
        return _taskIds;
    }

    function getTask(uint256 taskId) external view override returns (ITypes.Task memory) {
        return tasks[taskId];
    }

    function updateTask(uint256 taskId, ITypes.Task memory task) external override {
        tasks[taskId] = task;
    }

    function getUserTasks(address user) external view override returns (uint256[] memory) {
        return userTasks[user];
    }

    function exists(uint256 taskId) external view override returns (bool) {
        return tasks[taskId].id != 0;
    }
}

// pragma solidity ^0.8.19;

// import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

// import "../interfaces/ITask.sol";
// import "../interfaces/ITypes.sol";

// contract TaskStorage is Initializable, ITask {

//     uint256 private _taskIds;
    
//     mapping(uint256 => ITypes.Task) private tasks;
//     mapping(address => uint256[]) private userTasks;

//     function initialize() public initializer {
//         _taskIds++; // Start from 1
//     }

//     function storeTask(ITypes.Task memory task) external override returns (uint256) {
//         _taskIds++;
//         uint256 newTaskId = _taskIds;
        
//         task.id = newTaskId;
//         tasks[newTaskId] = task;
//         userTasks[task.owner].push(newTaskId);
        
//         return newTaskId;
//     }

//     function getTask(uint256 taskId) external view override returns (ITypes.Task memory) {
//         return tasks[taskId];
//     }

//     function updateTask(uint256 taskId, ITypes.Task memory task) external override {
//         require(tasks[taskId].id != 0, "Task does not exist");
//         tasks[taskId] = task;
//     }

//     function deleteTask(uint256 taskId) external override {
//         require(tasks[taskId].id != 0, "Task does not exist");
//         tasks[taskId].isDeleted = true;
//     }

//     function getUserTasks(address user) external view override returns (uint256[] memory) {
//         return userTasks[user];
//     }
// }
