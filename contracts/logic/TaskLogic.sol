// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

// import "../interfaces/ITypes.sol" as ITypes;
import "../interfaces/ITaskStorage.sol";
import "../interfaces/IStorageAccessRegistry.sol";
import "../libraries/ValidationLib.sol";
import "../libraries/TaskLib.sol";
import "../interfaces/ITaskLogic.sol";
import "../interfaces/ITypes.sol";

/// @title TaskLogic
/// @notice Handles core task operations in a modular, upgradable, secure way
contract TaskLogic is Initializable,UUPSUpgradeable, OwnableUpgradeable, ReentrancyGuardUpgradeable, ITaskLogic {
    using TaskLib for ITypes.Task;

    IStorageAccessRegistry public registry;

/// @custom:oz-upgrades-unsafe-allow constructor
constructor() {
    _disableInitializers();
}
    function initialize(address registryAddress) public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        __ReentrancyGuard_init();
        registry = IStorageAccessRegistry(registryAddress);
    }
    function _authorizeUpgrade(address) internal override onlyOwner {}
    function setRegistry(address registryAddress) external onlyOwner {
        require(registryAddress != address(0), "Zero address not allowed");
        registry = IStorageAccessRegistry(registryAddress);
    }

    modifier onlyExistingTask(uint256 taskId) {
        ITaskStorage taskStorage = ITaskStorage(registry.getContract("TASK_STORAGE"));
        require(taskStorage.exists(taskId), "Task does not exist");
        _;
    }

    function createTask(ITypes.TaskCreationParams calldata taskParams) external returns (uint256) {
        ITaskStorage taskStorage = ITaskStorage(registry.getContract("TASK_STORAGE"));

        ValidationLib.validateTaskCreation(taskParams.content, taskParams.dueDate);

        ITypes.Task memory newTask = TaskLib.buildTask(
            0,
            taskParams.content,
            taskParams.description,
            taskParams.priority,
            taskParams.dueDate,
            taskParams.categoryId,
            taskParams.tags,
            taskParams.owner
        );
        emit TaskAddedInQueue(newTask.id, newTask.owner, block.timestamp);
        return taskStorage.storeTask(newTask);
    }

    function updateTask(ITypes.TaskUpdateParams calldata taskUpdateParams) external onlyExistingTask(taskUpdateParams.taskId) returns (ITypes.Task memory) {
        ITaskStorage taskStorage = ITaskStorage(registry.getContract("TASK_STORAGE"));
        ITypes.Task memory task = taskStorage.getTask(taskUpdateParams.taskId);

        ValidationLib.validateTaskModification(task, taskUpdateParams.caller);
        ValidationLib.validateTaskCreation(taskUpdateParams.content, taskUpdateParams.dueDate);

        task.content = taskUpdateParams.content;
        task.description = taskUpdateParams.description;
        task.priority = taskUpdateParams.priority;
        task.dueDate = taskUpdateParams.dueDate;
        task.tags = taskUpdateParams.tags;
        task.updatedAt = block.timestamp;

        taskStorage.updateTask(taskUpdateParams.taskId, task);
        return task;
    }

    function updateTaskStatus(
        uint256 taskId,
        ITypes.TaskStatus status,
        address caller
    ) external onlyExistingTask(taskId) {
        ITaskStorage taskStorage = ITaskStorage(registry.getContract("TASK_STORAGE"));
        ITypes.Task memory task = taskStorage.getTask(taskId);

        ValidationLib.validateTaskModification(task, caller);
        task.status = status;
        task.updatedAt = block.timestamp;

        taskStorage.updateTask(taskId, task);
    }

    function deleteTask(uint256 taskId, address caller) external onlyExistingTask(taskId) {
        ITaskStorage taskStorage = ITaskStorage(registry.getContract("TASK_STORAGE"));
        ITypes.Task memory task = taskStorage.getTask(taskId);

        ValidationLib.validateTaskModification(task, caller);
        task.isDeleted = true;
        task.updatedAt = block.timestamp;

        taskStorage.updateTask(taskId, task);
    }

    function getTask(uint256 taskId) external view onlyExistingTask(taskId) returns (ITypes.Task memory) {
        ITaskStorage taskStorage = ITaskStorage(registry.getContract("TASK_STORAGE"));
        ITypes.Task memory task = taskStorage.getTask(taskId);
        require(!task.isDeleted, "Task deleted");
        return task;
    }

    function getUserTasks(address user) external view returns (ITypes.Task[] memory) {
        ITaskStorage taskStorage = ITaskStorage(registry.getContract("TASK_STORAGE"));
        uint256[] memory ids = taskStorage.getUserTasks(user);
        uint256 activeCount;

        for (uint256 i = 0; i < ids.length; i++) {
            ITypes.Task memory t = taskStorage.getTask(ids[i]);
            if (!t.isDeleted) activeCount++;
        }

        ITypes.Task[] memory result = new ITypes.Task[](activeCount);
        uint256 j;
        for (uint256 i = 0; i < ids.length; i++) {
            ITypes.Task memory t = taskStorage.getTask(ids[i]);
            if (!t.isDeleted) {
                result[j++] = t;
            }
        }
        return result;
    }

}
