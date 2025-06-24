// src/components/tasks/TaskForm/index.tsx
import React, { useState } from 'react';
// import { useContract } from '@/hooks/useContract';?
import PrioritySelect from './prioritySelect';
import DatePicker from './datePicker';
import toast from 'react-hot-toast';

const TaskForm: React.FC = () => {
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState(0);
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
//   const { contract } = useContract();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
    //   await contract?.createTask(content, priority, new Date(dueDate).getTime());
      setContent('');
      setPriority(0);
      setDueDate('');
      toast.success('Task created successfully!');
    } catch (error) {
      toast.error('Failed to create task');
      console.error(error);
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
          placeholder="What needs to be done?"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-4">
        <div className="w-1/3">
          <PrioritySelect 
            value={priority} 
            onChange={setPriority} 
          />
        </div>
        <div className="w-1/3">
          <DatePicker 
            value={dueDate} 
            onChange={setDueDate} 
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={!content.trim() || loading}
        className={`
          w-full px-4 py-2 text-white bg-blue-600 rounded-lg
          ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}
        `}
      >
        {loading ? 'Creating...' : 'Add Task'}
      </button>
    </form>
  );
};

export default TaskForm;