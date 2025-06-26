// interfaces/ITodoList.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface ITypes {
    enum Priority {
        LOW,
        MEDIUM,
        HIGH
    }
    enum TaskStatus {
        PENDING,
        IN_PROGRESS,
        COMPLETED,
        ARCHIVED
    }

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
    struct TaskCreationParams {
        address owner;
        string content;
        string description;
        Priority priority;
        uint256 dueDate;
        uint256 categoryId;
        string[] tags;
    }
    struct TaskUpdateParams {
        uint256 taskId;
        string content;
        string description;
        Priority priority;
        uint256 dueDate;
        string[] tags;
        address caller;
    }
}
