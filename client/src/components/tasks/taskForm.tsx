// src/components/tasks/TaskForm.tsx
import React, { useState } from 'react';
// import { useContract } from '@/hooks/useContract';
import Button from '../common/button2';

const TaskForm: React.FC = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
//   const { contract } = useContract();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
    //   await contract?.createTask(content);
      setContent('');
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter your task..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <Button
        type="submit"
        disabled={!content.trim() || loading}
        loading={loading}
      >
        Add Task
      </Button>
    </form>
  );
};

export default TaskForm;