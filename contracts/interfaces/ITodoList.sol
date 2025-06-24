// interfaces/ITodoList.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface ITodoList {
    enum Priority { LOW, MEDIUM, HIGH }
    enum TaskStatus { PENDING, IN_PROGRESS, COMPLETED, ARCHIVED }

    struct Task {
        uint256 id;
        string content;
        string description;
        TaskStatus status;
        Priority priority;
        uint256 dueDate;
        uint256 createdAt;
        uint256 updatedAt;
        address owner;
        bool isDeleted;
        string[] tags;
        uint256 categoryId;
    }

    struct Category {
        uint256 id;
        string name;
        string color;
        address owner;
    }

    // Events
    event TaskCreated(uint256 indexed id, string content, address indexed owner, uint256 timestamp);
    event TaskUpdated(uint256 indexed id, string content, TaskStatus status, uint256 timestamp);
    event TaskStatusChanged(uint256 indexed id, TaskStatus newStatus, uint256 timestamp);
    event TaskDeleted(uint256 indexed id, uint256 timestamp);
    event CategoryCreated(uint256 indexed id, string name, address indexed owner);

    // Core functions
    function createTask(string memory _content, string memory _description, Priority _priority, 
        uint256 _dueDate, uint256 _categoryId, string[] memory _tags) external returns (uint256);
    function updateTask(uint256 _taskId, string memory _content, string memory _description, 
        Priority _priority, uint256 _dueDate, string[] memory _tags) external;
    function updateTaskStatus(uint256 _taskId, TaskStatus _status) external;
    function deleteTask(uint256 _taskId) external;
    function getTask(uint256 _taskId) external view returns (Task memory);
    function getUserTasks() external view returns (Task[] memory);
}