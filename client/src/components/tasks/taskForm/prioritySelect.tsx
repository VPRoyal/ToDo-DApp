// src/components/tasks/TaskForm/PrioritySelect.tsx
import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export interface Priority {
  id: number;
  name: string;
  color: string;
}

interface PrioritySelectProps {
  value: number;
  onChange: (value: number) => void;
}

const priorities: Priority[] = [
  { id: 0, name: 'Low', color: 'bg-gray-200' },
  { id: 1, name: 'Medium', color: 'bg-yellow-200' },
  { id: 2, name: 'High', color: 'bg-red-200' },
];

const PrioritySelect: React.FC<PrioritySelectProps> = ({ value, onChange }) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {priorities.map((priority) => (
          <option key={priority.id} value={priority.id}>
            {priority.name}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      
      <div className="absolute top-1/2 transform -translate-y-1/2 left-3 flex items-center">
        <div className={`w-2 h-2 rounded-full ${priorities[value].color} mr-2`} />
      </div>
    </div>
  );
};

export default PrioritySelect;