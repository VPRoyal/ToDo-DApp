// libraries/TaskLib.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../interfaces/ITodoList.sol";

library TaskLib {
    function createTaskStruct(
        uint256 id,
        string memory content,
        string memory description,
        ITodoList.Priority priority,
        uint256 dueDate,
        uint256 categoryId,
        string[] memory tags,
        address owner
    ) internal view returns (ITodoList.Task memory) {
        return ITodoList.Task({
            id: id,
            content: content,
            description: description,
            status: ITodoList.TaskStatus.PENDING,
            priority: priority,
            dueDate: dueDate,
            createdAt: block.timestamp,
            updatedAt: block.timestamp,
            owner: owner,
            isDeleted: false,
            tags: tags,
            categoryId: categoryId
        });
    }
}