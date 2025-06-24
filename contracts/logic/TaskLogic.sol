// logic/TaskLogic.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "../interfaces/ITodoList.sol";
import "../interfaces/ITaskStorage.sol";
import "../libraries/ValidationLib.sol";
import "../libraries/TaskLib.sol";

/**
 * @title TaskLogic
 * @dev Logic contract for task management operations
 */
contract TaskLogic is Initializable, UUPSUpgradeable, OwnableUpgradeable, ReentrancyGuardUpgradeable {
    ITaskStorage private _taskStorage;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    // Events
    event TaskMetadataUpdated(uint256 indexed taskId, string newDescription);
    event TaskTagsUpdated(uint256 indexed taskId, string[] newTags);
    event TaskCategoryUpdated(uint256 indexed taskId, uint256 newCategoryId);
    event TaskPriorityUpdated(uint256 indexed taskId, ITodoList.Priority newPriority);

    /**
     * @dev Initializes the contract
     * @param taskStorage Address of the task storage contract
     */
    function initialize(address taskStorage) public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        __ReentrancyGuard_init();
        
        _taskStorage = ITaskStorage(taskStorage);
    }

    /**
     * @dev Creates a new task
     */
    function createTask(
        string calldata _content,
        string calldata _description,
        ITodoList.Priority _priority,
        uint256 _dueDate,
        uint256 _categoryId,
        string[] calldata _tags
    ) external nonReentrant returns (uint256) {
        ValidationLib.validateTaskCreation(_content, _dueDate, msg.sender);

        ITodoList.Task memory newTask = TaskLib.createTaskStruct(
            0, // ID will be assigned by storage
            _content,
            _description,
            _priority,
            _dueDate,
            _categoryId,
            _tags,
            msg.sender
        );

        return _taskStorage.storeTask(newTask);
    }

    /**
     * @dev Updates an existing task
     */
    function updateTask(
        uint256 _taskId,
        string calldata _content,
        string calldata _description,
        ITodoList.Priority _priority,
        uint256 _dueDate,
        string[] calldata _tags,
        address _caller
    ) external nonReentrant returns (ITodoList.Task memory) {
        ITodoList.Task memory task = _taskStorage.getTask(_taskId);
        ValidationLib.validateTaskModification(task, _caller);
        ValidationLib.validateTaskCreation(_content, _dueDate, _caller);

        task.content = _content;
        task.description = _description;
        task.priority = _priority;
        task.dueDate = _dueDate;
        task.tags = _tags;
        task.updatedAt = block.timestamp;

        _taskStorage.updateTask(_taskId, task);
        return task;
    }

    /**
     * @dev Updates task status
     */
    function updateTaskStatus(
        uint256 _taskId,
        ITodoList.TaskStatus _status,
        address _caller
    ) external nonReentrant {
        ITodoList.Task memory task = _taskStorage.getTask(_taskId);
        ValidationLib.validateTaskModification(task, _caller);

        task.status = _status;
        task.updatedAt = block.timestamp;

        _taskStorage.updateTask(_taskId, task);
    }

    /**
     * @dev Marks a task as deleted (soft delete)
     */
    function deleteTask(
        uint256 _taskId,
        address _caller
    ) external nonReentrant {
        ITodoList.Task memory task = _taskStorage.getTask(_taskId);
        ValidationLib.validateTaskModification(task, _caller);

        task.isDeleted = true;
        task.updatedAt = block.timestamp;

        _taskStorage.updateTask(_taskId, task);
    }

    /**
     * @dev Gets a single task
     */
    function getTask(
        uint256 _taskId
    ) external view returns (ITodoList.Task memory) {
        return _taskStorage.getTask(_taskId);
    }

    /**
     * @dev Gets all tasks for a user
     */
    function getUserTasks(
        address _user
    ) external view returns (ITodoList.Task[] memory) {
        uint256[] memory taskIds = _taskStorage.getUserTasks(_user);
        ITodoList.Task[] memory tasks = new ITodoList.Task[](taskIds.length);
        uint256 activeCount = 0;

        // First count non-deleted tasks
        for (uint256 i = 0; i < taskIds.length; i++) {
            ITodoList.Task memory task = _taskStorage.getTask(taskIds[i]);
            if (!task.isDeleted) {
                activeCount++;
            }
        }

        // Create array of active tasks
        ITodoList.Task[] memory activeTasks = new ITodoList.Task[](activeCount);
        uint256 j = 0;
        for (uint256 i = 0; i < taskIds.length; i++) {
            ITodoList.Task memory task = _taskStorage.getTask(taskIds[i]);
            if (!task.isDeleted) {
                activeTasks[j] = task;
                j++;
            }
        }

        return activeTasks;
    }

    /**
     * @dev Gets tasks by status
     */
    function getTasksByStatus(
        address _user,
        ITodoList.TaskStatus _status
    ) external view returns (ITodoList.Task[] memory) {
        ITodoList.Task[] memory allTasks = this.getUserTasks(_user);
        uint256 count = 0;

        // Count tasks with matching status
        for (uint256 i = 0; i < allTasks.length; i++) {
            if (allTasks[i].status == _status) {
                count++;
            }
        }

        // Create filtered array
        ITodoList.Task[] memory filteredTasks = new ITodoList.Task[](count);
        uint256 j = 0;
        for (uint256 i = 0; i < allTasks.length; i++) {
            if (allTasks[i].status == _status) {
                filteredTasks[j] = allTasks[i];
                j++;
            }
        }

        return filteredTasks;
    }

    /**
     * @dev Gets tasks by priority
     */
    function getTasksByPriority(
        address _user,
        ITodoList.Priority _priority
    ) external view returns (ITodoList.Task[] memory) {
        ITodoList.Task[] memory allTasks = this.getUserTasks(_user);
        uint256 count = 0;

        for (uint256 i = 0; i < allTasks.length; i++) {
            if (allTasks[i].priority == _priority) {
                count++;
            }
        }

        ITodoList.Task[] memory filteredTasks = new ITodoList.Task[](count);
        uint256 j = 0;
        for (uint256 i = 0; i < allTasks.length; i++) {
            if (allTasks[i].priority == _priority) {
                filteredTasks[j] = allTasks[i];
                j++;
            }
        }

        return filteredTasks;
    }

    /**
     * @dev Gets tasks by category
     */
    function getTasksByCategory(
        address _user,
        uint256 _categoryId
    ) external view returns (ITodoList.Task[] memory) {
        ITodoList.Task[] memory allTasks = this.getUserTasks(_user);
        uint256 count = 0;

        for (uint256 i = 0; i < allTasks.length; i++) {
            if (allTasks[i].categoryId == _categoryId) {
                count++;
            }
        }

        ITodoList.Task[] memory filteredTasks = new ITodoList.Task[](count);
        uint256 j = 0;
        for (uint256 i = 0; i < allTasks.length; i++) {
            if (allTasks[i].categoryId == _categoryId) {
                filteredTasks[j] = allTasks[i];
                j++;
            }
        }

        return filteredTasks;
    }

    /**
     * @dev Gets tasks due before a specific timestamp
     */
    function getTasksDueBefore(
        address _user,
        uint256 _timestamp
    ) external view returns (ITodoList.Task[] memory) {
        ITodoList.Task[] memory allTasks = this.getUserTasks(_user);
        uint256 count = 0;

        for (uint256 i = 0; i < allTasks.length; i++) {
            if (allTasks[i].dueDate < _timestamp) {
                count++;
            }
        }

        ITodoList.Task[] memory filteredTasks = new ITodoList.Task[](count);
        uint256 j = 0;
        for (uint256 i = 0; i < allTasks.length; i++) {
            if (allTasks[i].dueDate < _timestamp) {
                filteredTasks[j] = allTasks[i];
                j++;
            }
        }

        return filteredTasks;
    }

    /**
     * @dev Gets task count by status
     */
    function getTaskCountByStatus(
        address _user,
        ITodoList.TaskStatus _status
    ) external view returns (uint256) {
        ITodoList.Task[] memory allTasks = this.getUserTasks(_user);
        uint256 count = 0;

        for (uint256 i = 0; i < allTasks.length; i++) {
            if (allTasks[i].status == _status) {
                count++;
            }
        }

        return count;
    }

    /**
     * @dev Function that should revert when msg.sender is not authorized to upgrade the contract
     */
    function _authorizeUpgrade(address) internal override onlyOwner {}
}