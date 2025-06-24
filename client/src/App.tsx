// src/App.tsx
import React from 'react';
import MainLayout from './components/layout/mainLayout';
import TaskForm from './components/tasks/taskList';
import TaskList from './components/tasks/taskList';
import { useWeb3 } from './hooks/useWeb3';

const App: React.FC = () => {
  const { address, connect } = useWeb3();

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        {!address ? (
          <div className="text-center py-10">
            <h2 className="text-2xl font-bold mb-4">
              Welcome to Todo DApp
            </h2>
            <button
              onClick={connect}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">
                Create New Task
              </h2>
              <TaskForm />
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">
                Your Tasks
              </h2>
              <TaskList />
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default App;