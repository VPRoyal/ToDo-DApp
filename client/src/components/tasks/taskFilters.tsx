// src/components/tasks/TaskList/TaskFilters.tsx
import React from 'react';

interface TaskFiltersProps {
  currentFilter: 'all' | 'active' | 'completed';
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({ currentFilter, onFilterChange }) => {
  return (
    <div className="flex gap-2 mb-4">
      {['all', 'active', 'completed'].map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter as 'all' | 'active' | 'completed')}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium
            ${currentFilter === filter 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
          `}
        >
          {filter.charAt(0).toUpperCase() + filter.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default TaskFilters;