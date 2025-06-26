// interfaces/ITodoList.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "./ITypes.sol";
interface ITodoList {
    // Events
    event TaskCreated(uint256 indexed id, string content, address indexed owner, uint256 timestamp);
    event TaskUpdated(uint256 indexed id, string content, ITypes.TaskStatus status, uint256 timestamp);
    event TaskStatusChanged(uint256 indexed id, ITypes.TaskStatus newStatus, uint256 timestamp);
    event TaskDeleted(uint256 indexed id, uint256 timestamp);
    event CategoryCreated(uint256 indexed id, string name, address indexed owner);

    // Core functions
    function createTask(string memory _content, string memory _description, ITypes.Priority _priority, 
        uint256 _dueDate, uint256 _categoryId, string[] memory _tags) external returns (uint256);
    function updateTask(uint256 _taskId, string memory _content, string memory _description, 
        ITypes.Priority _priority, uint256 _dueDate, string[] memory _tags) external;
    function updateTaskStatus(uint256 _taskId, ITypes.TaskStatus _status) external;
    function deleteTask(uint256 _taskId) external;
    function getTask(uint256 _taskId) external view returns (ITypes.Task memory);
    function getUserTasks() external view returns (ITypes.Task[] memory);
    function createCategory(string memory name, string memory color) external returns (uint256);
    function getUserCategories() external view returns (ITypes.Category[] memory);
}