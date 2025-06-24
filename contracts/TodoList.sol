// TodoList.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";

import "./interfaces/ITodoList.sol";
import "./logic/TaskLogic.sol";
import "./logic/CategoryLogic.sol";

contract TodoList is 
    ITodoList, 
    Initializable, 
    UUPSUpgradeable, 
    OwnableUpgradeable,
    ReentrancyGuardUpgradeable,
    PausableUpgradeable
{
    TaskLogic private _taskLogic;
    CategoryLogic private _categoryLogic;

    // Events (in addition to interface events)
    event TaskTagsUpdated(uint256 indexed taskId, string[] tags);
    event TaskPriorityChanged(uint256 indexed taskId, Priority newPriority);
    event TaskDueDateChanged(uint256 indexed taskId, uint256 newDueDate);
    event BatchTasksCreated(uint256[] taskIds);
    event BatchTasksDeleted(uint256[] taskIds);

    function initialize(
        address taskLogic,
        address categoryLogic
    ) public initializer {
        __Ownable_init(msg.sender);
        // __Initializable_init();
        __UUPSUpgradeable_init();
        __ReentrancyGuard_init();
        __Pausable_init();

        
        _taskLogic = TaskLogic(taskLogic);
        _categoryLogic = CategoryLogic(categoryLogic);
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}

    // Task Management Functions

    /// @notice Create a new task
    function createTask(
        string memory _content,
        string memory _description,
        Priority _priority,
        uint256 _dueDate,
        uint256 _categoryId,
        string[] memory _tags
    ) external override nonReentrant returns (uint256) {
        uint256 taskId = _taskLogic.createTask(
            _content,
            _description,
            _priority,
            _dueDate,
            _categoryId,
            _tags
        );
        
        emit TaskCreated(taskId, _content, msg.sender, block.timestamp);
        return taskId;
    }

    /// @notice Update an existing task
    function updateTask(
        uint256 _taskId,
        string memory _content,
        string memory _description,
        Priority _priority,
        uint256 _dueDate,
        string[] memory _tags
    ) external override nonReentrant {
        Task memory updatedTask = _taskLogic.updateTask(
            _taskId,
            _content,
            _description,
            _priority,
            _dueDate,
            _tags,
            msg.sender
        );
        
        emit TaskUpdated(_taskId, _content, updatedTask.status, block.timestamp);
    }

    /// @notice Update task status
    function updateTaskStatus(
        uint256 _taskId, 
        TaskStatus _status
    ) external override nonReentrant {
        _taskLogic.updateTaskStatus(_taskId, _status, msg.sender);
        emit TaskStatusChanged(_taskId, _status, block.timestamp);
    }

    /// @notice Delete a task
    function deleteTask(
        uint256 _taskId
    ) external override nonReentrant {
        _taskLogic.deleteTask(_taskId, msg.sender);
        emit TaskDeleted(_taskId, block.timestamp);
    }

    /// @notice Batch create tasks
    function batchCreateTasks(
        string[] memory _contents,
        string[] memory _descriptions,
        Priority[] memory _priorities,
        uint256[] memory _dueDates,
        uint256[] memory _categoryIds,
        string[][] memory _tags
    ) external nonReentrant returns (uint256[] memory) {
        require(
            _contents.length == _descriptions.length &&
            _contents.length == _priorities.length &&
            _contents.length == _dueDates.length &&
            _contents.length == _categoryIds.length &&
            _contents.length == _tags.length,
            "Array lengths must match"
        );

        uint256[] memory taskIds = new uint256[](_contents.length);

        for (uint256 i = 0; i < _contents.length; i++) {
            taskIds[i] = this.createTask(
                _contents[i],
                _descriptions[i],
                _priorities[i],
                _dueDates[i],
                _categoryIds[i],
                _tags[i]
            );
        }

        emit BatchTasksCreated(taskIds);
        return taskIds;
    }

    /// @notice Batch delete tasks
    function batchDeleteTasks(
        uint256[] memory _taskIds
    ) external nonReentrant {
        for (uint256 i = 0; i < _taskIds.length; i++) {
            this.deleteTask(_taskIds[i]);
        }
        emit BatchTasksDeleted(_taskIds);
    }

    // Category Management Functions

    /// @notice Create a new category
    function createCategory(
        string memory _name,
        string memory _color
    ) external nonReentrant returns (uint256) {
        uint256 categoryId = _categoryLogic.createCategory(_name, _color);
        emit CategoryCreated(categoryId, _name, msg.sender);
        return categoryId;
    }

    // View Functions

    /// @notice Get a single task
    function getTask(
        uint256 _taskId
    ) external view override returns (Task memory) {
        return _taskLogic.getTask(_taskId);
    }

    /// @notice Get all tasks for the caller
    function getUserTasks() external view override returns (Task[] memory) {
        return _taskLogic.getUserTasks(msg.sender);
    }

    /// @notice Get tasks by status
    function getTasksByStatus(
        TaskStatus _status
    ) external view returns (Task[] memory) {
        return _taskLogic.getTasksByStatus(msg.sender, _status);
    }

    /// @notice Get tasks by priority
    function getTasksByPriority(
        Priority _priority
    ) external view returns (Task[] memory) {
        return _taskLogic.getTasksByPriority(msg.sender, _priority);
    }

    /// @notice Get tasks by category
    function getTasksByCategory(
        uint256 _categoryId
    ) external view returns (Task[] memory) {
        return _taskLogic.getTasksByCategory(msg.sender, _categoryId);
    }

    /// @notice Get tasks due before a specific timestamp
    function getTasksDueBefore(
        uint256 _timestamp
    ) external view returns (Task[] memory) {
        return _taskLogic.getTasksDueBefore(msg.sender, _timestamp);
    }

    /// @notice Get all categories for the caller
    function getUserCategories() external view returns (Category[] memory) {
        return _categoryLogic.getUserCategories();
    }

    /// @notice Get task count by status
    function getTaskCountByStatus(
        TaskStatus _status
    ) external view returns (uint256) {
        return _taskLogic.getTaskCountByStatus(msg.sender, _status);
    }

    /// @notice Get completion rate for user's tasks
    function getCompletionRate() external view returns (uint256) {
        Task[] memory tasks = this.getUserTasks();
        if (tasks.length == 0) return 0;

        uint256 completedCount = 0;
        for (uint256 i = 0; i < tasks.length; i++) {
            if (tasks[i].status == TaskStatus.COMPLETED) {
                completedCount++;
            }
        }

        return (completedCount * 100) / tasks.length;
    }

    // Utility Functions

    /// @notice Check if a task exists and is owned by the caller
    function isTaskOwner(
        uint256 _taskId
    ) external view returns (bool) {
        Task memory task = _taskLogic.getTask(_taskId);
        return task.owner == msg.sender;
    }

    /// @notice Get contract version
    function getVersion() external pure returns (string memory) {
        return "1.0.0";
    }

    /// @notice Emergency pause (only owner)
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice Emergency unpause (only owner)
    function unpause() external onlyOwner {
        _unpause();
    }
}





