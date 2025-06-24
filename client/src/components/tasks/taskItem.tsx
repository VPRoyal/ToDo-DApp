// src/components/tasks/TaskList/TaskItem.tsx
import React, { useState } from 'react';
import type { Task } from '@/types';
// import { useContract } from '@/hooks/useContract';
import { CheckCircleIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface TaskItemProps {
  task: Task;
  onUpdate: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(task.content);
  const [loading, setLoading] = useState(false);
  // const { contract } = useContract();

  const handleToggleComplete = async () => {
    try {
      setLoading(true);
      // await contract?.toggleTaskComplete(task.id);
      toast.success('Task status updated');
      onUpdate();
    } catch (error) {
      toast.error('Failed to update task');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      // await contract?.deleteTask(task.id);
      toast.success('Task deleted');
      onUpdate();
    } catch (error) {
      toast.error('Failed to delete task');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (editedContent.trim() === task.content) {
      setIsEditing(false);
      return;
    }

    try {
      setLoading(true);
      // await contract?.updateTask(task.id, editedContent);
      toast.success('Task updated');
      onUpdate();
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update task');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`
      bg-white rounded-lg shadow-sm p-4 
      ${loading ? 'opacity-50' : ''}
      ${task.completed ? 'bg-gray-50' : ''}
    `}>
      <div className="flex items-center gap-3">
        <button
          onClick={handleToggleComplete}
          disabled={loading}
          className="text-gray-400 hover:text-green-500 transition-colors"
        >
          <CheckCircleIcon 
            className={`w-6 h-6 ${task.completed ? 'text-green-500' : ''}`} 
          />
        </button>

        {isEditing ? (
          <input
            type="text"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="flex-1 px-2 py-1 border rounded"
            onBlur={handleUpdate}
            onKeyPress={(e) => e.key === 'Enter' && handleUpdate()}
            autoFocus
          />
        ) : (
          <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : ''}`}>
            {task.content}
          </span>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            disabled={loading}
            className="text-gray-400 hover:text-blue-500 transition-colors"
          >
            <PencilIcon className="w-5 h-5" />
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;