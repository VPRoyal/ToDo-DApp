// src/components/tasks/TaskForm/DatePicker.tsx
import React from 'react';
import { CalendarIcon } from '@heroicons/react/24/outline';

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  min?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({ 
  value, 
  onChange, 
  min = new Date().toISOString().split('T')[0] 
}) => {
  return (
    <div className="relative">
      <input
        type="date"
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
    </div>
  );
};

export default DatePicker;