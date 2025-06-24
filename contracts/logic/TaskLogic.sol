// logic/TaskLogic.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "../interfaces/ITodoList.sol";
import "../interfaces/ITaskStorage.sol";
import "../libraries/ValidationLib.sol";
import "../libraries/TaskLib.sol";

contract TaskLogic is Initializable, OwnableUpgradeable {
    ITaskStorage private _taskStorage;

    function initialize(address taskStorage) public initializer {
        __Ownable_init();
        _taskStorage = ITaskStorage(taskStorage);
    }

    function createTask(
        string memory _content,
        string memory _description,
        ITodoList.Priority _priority,
        uint256 _dueDate,
        uint256 _categoryId,
        string[] memory _tags
    ) external returns (uint256) {
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

        uint256 taskId = _taskStorage.storeTask(newTask);
        return taskId;
    }

    // Add other task-related logic functions
}