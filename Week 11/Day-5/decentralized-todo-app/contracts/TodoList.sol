// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title TodoList
 * @dev A decentralized todo list application with gas-optimized operations
 * @author Abdullah Jabbar
 */
contract TodoList {
    // Custom errors for gas optimization
    error TaskNotFound();
    error EmptyTaskContent();
    error UnauthorizedAccess();
    error TaskAlreadyCompleted();
    error TaskNotCompleted();

    // Task structure optimized for storage
    struct Task {
        string content;           // Task description
        bool isCompleted;        // Completion status
        uint32 createdAt;        // Creation timestamp (uint32 for gas optimization)
        uint8 priority;          // Priority level (1-5)
        bytes32 category;        // Category as bytes32 for gas efficiency
    }

    // State variables
    mapping(address => Task[]) private userTasks;
    mapping(address => uint256) public taskCounts;
    
    // Events for frontend integration
    event TaskCreated(
        address indexed user,
        uint256 indexed taskId,
        string content,
        uint8 priority,
        bytes32 category
    );
    
    event TaskToggled(
        address indexed user,
        uint256 indexed taskId,
        bool isCompleted
    );
    
    event TaskUpdated(
        address indexed user,
        uint256 indexed taskId,
        string newContent
    );
    
    event TaskDeleted(
        address indexed user,
        uint256 indexed taskId
    );

    // Modifiers
    modifier validTaskId(uint256 _taskId) {
        if (_taskId >= userTasks[msg.sender].length) {
            revert TaskNotFound();
        }
        _;
    }

    modifier nonEmptyContent(string memory _content) {
        if (bytes(_content).length == 0) {
            revert EmptyTaskContent();
        }
        _;
    }

    /**
     * @dev Create a new task
     * @param _content Task description
     * @param _priority Priority level (1-5, default 3)
     * @param _category Task category as string (converted to bytes32)
     */
    function createTask(
        string memory _content,
        uint8 _priority,
        string memory _category
    ) external nonEmptyContent(_content) {
        // Validate priority
        if (_priority == 0 || _priority > 5) {
            _priority = 3; // Default priority
        }

        // Convert category to bytes32 for gas efficiency
        bytes32 categoryBytes = stringToBytes32(_category);

        // Create new task
        Task memory newTask = Task({
            content: _content,
            isCompleted: false,
            createdAt: uint32(block.timestamp),
            priority: _priority,
            category: categoryBytes
        });

        // Add to user's tasks
        userTasks[msg.sender].push(newTask);
        uint256 taskId = userTasks[msg.sender].length - 1;
        taskCounts[msg.sender]++;

        emit TaskCreated(msg.sender, taskId, _content, _priority, categoryBytes);
    }

    /**
     * @dev Toggle task completion status
     * @param _taskId Task ID to toggle
     */
    function toggleTask(uint256 _taskId) external validTaskId(_taskId) {
        Task storage task = userTasks[msg.sender][_taskId];
        task.isCompleted = !task.isCompleted;

        emit TaskToggled(msg.sender, _taskId, task.isCompleted);
    }

    /**
     * @dev Update task content
     * @param _taskId Task ID to update
     * @param _newContent New task description
     */
    function updateTask(
        uint256 _taskId,
        string memory _newContent
    ) external validTaskId(_taskId) nonEmptyContent(_newContent) {
        userTasks[msg.sender][_taskId].content = _newContent;

        emit TaskUpdated(msg.sender, _taskId, _newContent);
    }

    /**
     * @dev Delete a task (marks as deleted by moving last task to deleted position)
     * @param _taskId Task ID to delete
     */
    function deleteTask(uint256 _taskId) external validTaskId(_taskId) {
        Task[] storage tasks = userTasks[msg.sender];
        uint256 lastIndex = tasks.length - 1;

        // If not the last task, move last task to deleted position
        if (_taskId != lastIndex) {
            tasks[_taskId] = tasks[lastIndex];
        }

        // Remove last task
        tasks.pop();
        taskCounts[msg.sender]--;

        emit TaskDeleted(msg.sender, _taskId);
    }

    /**
     * @dev Get all tasks for the caller
     * @return Array of all user's tasks
     */
    function getAllTasks() external view returns (Task[] memory) {
        return userTasks[msg.sender];
    }

    /**
     * @dev Get a specific task by ID
     * @param _taskId Task ID to retrieve
     * @return Task details
     */
    function getTask(uint256 _taskId) external view validTaskId(_taskId) returns (Task memory) {
        return userTasks[msg.sender][_taskId];
    }

    /**
     * @dev Get tasks by completion status
     * @param _completed Whether to get completed or pending tasks
     * @return Array of filtered tasks with their IDs
     */
    function getTasksByStatus(bool _completed) external view returns (Task[] memory, uint256[] memory) {
        Task[] storage allTasks = userTasks[msg.sender];
        uint256 count = 0;

        // Count matching tasks
        for (uint256 i = 0; i < allTasks.length; i++) {
            if (allTasks[i].isCompleted == _completed) {
                count++;
            }
        }

        // Create result arrays
        Task[] memory filteredTasks = new Task[](count);
        uint256[] memory taskIds = new uint256[](count);
        uint256 index = 0;

        // Fill result arrays
        for (uint256 i = 0; i < allTasks.length; i++) {
            if (allTasks[i].isCompleted == _completed) {
                filteredTasks[index] = allTasks[i];
                taskIds[index] = i;
                index++;
            }
        }

        return (filteredTasks, taskIds);
    }

    /**
     * @dev Get tasks by priority level
     * @param _priority Priority level to filter by
     * @return Array of filtered tasks with their IDs
     */
    function getTasksByPriority(uint8 _priority) external view returns (Task[] memory, uint256[] memory) {
        Task[] storage allTasks = userTasks[msg.sender];
        uint256 count = 0;

        // Count matching tasks
        for (uint256 i = 0; i < allTasks.length; i++) {
            if (allTasks[i].priority == _priority) {
                count++;
            }
        }

        // Create result arrays
        Task[] memory filteredTasks = new Task[](count);
        uint256[] memory taskIds = new uint256[](count);
        uint256 index = 0;

        // Fill result arrays
        for (uint256 i = 0; i < allTasks.length; i++) {
            if (allTasks[i].priority == _priority) {
                filteredTasks[index] = allTasks[i];
                taskIds[index] = i;
                index++;
            }
        }

        return (filteredTasks, taskIds);
    }

    /**
     * @dev Get task statistics for the user
     * @return total Total number of tasks
     * @return completed Number of completed tasks
     * @return pending Number of pending tasks
     */
    function getTaskStats() external view returns (
        uint256 total,
        uint256 completed,
        uint256 pending
    ) {
        Task[] storage tasks = userTasks[msg.sender];
        total = tasks.length;
        
        for (uint256 i = 0; i < tasks.length; i++) {
            if (tasks[i].isCompleted) {
                completed++;
            } else {
                pending++;
            }
        }
    }

    /**
     * @dev Convert string to bytes32 (for categories)
     * @param _source String to convert
     * @return result Bytes32 representation
     */
    function stringToBytes32(string memory _source) internal pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(_source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            result := mload(add(_source, 32))
        }
    }

    /**
     * @dev Convert bytes32 to string (for displaying categories)
     * @param _bytes32 Bytes32 to convert
     * @return String representation
     */
    function bytes32ToString(bytes32 _bytes32) external pure returns (string memory) {
        uint8 i = 0;
        while(i < 32 && _bytes32[i] != 0) {
            i++;
        }
        bytes memory bytesArray = new bytes(i);
        for (i = 0; i < 32 && _bytes32[i] != 0; i++) {
            bytesArray[i] = _bytes32[i];
        }
        return string(bytesArray);
    }

    /**
     * @dev Emergency function to clear all tasks (if needed)
     */
    function clearAllTasks() external {
        delete userTasks[msg.sender];
        taskCounts[msg.sender] = 0;
    }
}