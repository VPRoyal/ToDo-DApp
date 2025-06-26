// ITaskLogic Interface
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "./ITypes.sol";

interface ITaskLogic {
    function createTask(ITypes.TaskCreationParams calldata taskParams) external returns (uint256);

    function updateTask(ITypes.TaskUpdateParams calldata taskUpdateParams) external returns (ITypes.Task memory);

    function updateTaskStatus(
        uint256 taskId,
        ITypes.TaskStatus status,
        address caller
    ) external;

    function deleteTask(
        uint256 taskId,
        address caller
    ) external;

    function getTask(uint256 taskId) external view returns (ITypes.Task memory);

    function getUserTasks(address user) external view returns (ITypes.Task[] memory);
}


// interface ITaskStorage {
//     function storeTask(Task memory task) external returns (uint256);
//     function getTask(uint256 taskId) external view returns (Task memory);
//     function updateTask(uint256 taskId, Task memory task) external;
//     function deleteTask(uint256 taskId) external;
//     function getUserTasks(address user) external view returns (uint256[] memory);
// }



