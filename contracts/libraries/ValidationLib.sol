// libraries/ValidationLib.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "../interfaces/ITypes.sol";

/// @title ValidationLib
/// @notice Handles task-level validation and custom errors
library ValidationLib {
    error InvalidContent();
    error InvalidDueDate();
    error InvalidTask();
    error Unauthorized();

    function validateTaskCreation(
        string memory content,
        uint256 dueDate
    ) internal view {
        if (bytes(content).length == 0) revert InvalidContent();
        if (dueDate < block.timestamp) revert InvalidDueDate();
    }

    function validateTaskModification(
        ITypes.Task memory task,
        address sender
    ) internal pure {
        if (task.id == 0) revert InvalidTask();
        if (task.owner != sender) revert Unauthorized();
    }
}