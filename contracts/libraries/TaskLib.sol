// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../interfaces/ITypes.sol";

/// @title TaskLib
/// @notice Utility library for constructing task structs
library TaskLib {
    function buildTask(
        uint256 id,
        string memory content,
        string memory description,
        ITypes.Priority priority,
        uint256 dueDate,
        uint256 categoryId,
        string[] memory tags,
        address owner
    ) internal view returns (ITypes.Task memory) {
        return ITypes.Task({
            id: id,
            content: content,
            description: description,
            status: ITypes.TaskStatus.PENDING,
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
