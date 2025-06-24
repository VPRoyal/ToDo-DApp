// libraries/ValidationLib.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../interfaces/ITodoList.sol";

library ValidationLib {
    error InvalidContent();
    error InvalidDueDate();
    error InvalidTask();
    error Unauthorized();

    function validateTaskCreation(
        string memory content,
        uint256 dueDate,
        address sender
    ) internal view returns (bool) {
        if (bytes(content).length == 0) revert InvalidContent();
        if (dueDate < block.timestamp) revert InvalidDueDate();
        return true;
    }

    function validateTaskModification(
        ITodoList.Task memory task,
        address sender
    ) internal pure returns (bool) {
        if (task.id == 0) revert InvalidTask();
        if (task.owner != sender) revert Unauthorized();
        return true;
    }
}