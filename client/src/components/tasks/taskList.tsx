// src/components/tasks/TaskList/TaskList.tsx
import React, { useEffect, useState } from 'react';
import type { Task } from '../../types/index'
// import { useContract } from '../../hooks/';
import TaskItem from './taskItem';
import LoadingSpinner from '../common/loadingSpinner';
import TaskFilters from './taskFilters';

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  // const { contract } = useContract();

  // useEffect(() => {
  //   fetchTasks();
  // }, [contract]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      // const taskList = await contract?.getTasks();
      // setTasks(taskList || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <TaskFilters currentFilter={filter} onFilterChange={setFilter} />
      <div className="space-y-2">
        {filteredTasks.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No tasks found
          </p>
        ) : (
          filteredTasks.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onUpdate={fetchTasks}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;