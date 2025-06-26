// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";

import "../interfaces/ITodoList.sol";
import "../interfaces/ITaskLogic.sol";
import "../interfaces/ICategoryLogic.sol";
import "../interfaces/ITypes.sol";

/// @title TodoList Core Proxy Contract
/// @notice Handles task and category interaction through upgradeable proxy
contract TodoList is
    ITodoList,
    Initializable,
    UUPSUpgradeable,
    OwnableUpgradeable,
    ReentrancyGuardUpgradeable,
    PausableUpgradeable
{
    ITaskLogic public taskLogic;
    ICategoryLogic public categoryLogic;

    event TaskTagsUpdated(uint256 indexed taskId, string[] tags);
    event TaskPriorityChanged(uint256 indexed taskId, ITypes.Priority newPriority);
    event TaskDueDateChanged(uint256 indexed taskId, uint256 newDueDate);
    event BatchTasksCreated(uint256[] taskIds);
    event BatchTasksDeleted(uint256[] taskIds);

    function initialize(address _taskLogic, address _categoryLogic) public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        __ReentrancyGuard_init();
        __Pausable_init();

        taskLogic = ITaskLogic(_taskLogic);
        categoryLogic = ICategoryLogic(_categoryLogic);
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}

    // ----------- Task Management -----------

    function createTask(
        string memory content,
        string memory description,
        ITypes.Priority priority,
        uint256 dueDate,
        uint256 categoryId,
        string[] memory tags
    ) external override nonReentrant whenNotPaused returns (uint256) {
        ITypes.TaskCreationParams memory taskParams = ITypes.TaskCreationParams({
            content: content,
            description: description,
            priority: priority,
            dueDate: dueDate,
            categoryId: categoryId,
            tags: tags,
            owner: msg.sender
        });
        uint256 taskId = taskLogic.createTask(taskParams);
        emit TaskCreated(taskId, content, msg.sender, block.timestamp);
        return taskId;
    }

    function updateTask(
        uint256 taskId,
        string memory content,
        string memory description,
        ITypes.Priority priority,
        uint256 dueDate,
        string[] memory tags
    ) external override nonReentrant whenNotPaused {
        ITypes.TaskUpdateParams memory taskUpdateParams = ITypes.TaskUpdateParams({
            taskId: taskId,
            content: content,
            description: description,
            priority: priority,
            dueDate: dueDate,
            tags: tags,
            caller: msg.sender
        });
        ITypes.Task memory updated = taskLogic.updateTask(taskUpdateParams);
        emit TaskUpdated(taskId, updated.content, updated.status, block.timestamp);
    }

    function updateTaskStatus(uint256 taskId, ITypes.TaskStatus status) external override nonReentrant whenNotPaused {
        taskLogic.updateTaskStatus(taskId, status, msg.sender);
        emit TaskStatusChanged(taskId, status, block.timestamp);
    }

    function deleteTask(uint256 taskId) external override nonReentrant whenNotPaused {
        taskLogic.deleteTask(taskId, msg.sender);
        emit TaskDeleted(taskId, block.timestamp);
    }

    function getTask(uint256 taskId) external view override returns (ITypes.Task memory) {
        return taskLogic.getTask(taskId);
    }

    function getUserTasks() external view override returns (ITypes.Task[] memory) {
        return taskLogic.getUserTasks(msg.sender);
    }

    // ----------- Category Management -----------

    function createCategory(string memory name, string memory color)
        external
        nonReentrant
        whenNotPaused
        returns (uint256)
    {
        uint256 categoryId = categoryLogic.createCategory(msg.sender, name, color);
        emit CategoryCreated(categoryId, name, msg.sender);
        return categoryId;
    }

    function getUserCategories() external view returns (ITypes.Category[] memory) {
        return categoryLogic.getUserCategories(msg.sender);
    }

    // ----------- Admin Utilities -----------

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function getVersion() external pure returns (string memory) {
        return "2.0.0";
    }
}


