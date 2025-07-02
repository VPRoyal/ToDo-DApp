
import Header from "@/components/layout/header"
import Sidebar from "@/components/layout/sidebar"
import MainDashboard from "@/components/layout/mainDashboard"
import TransactionStatus from "@/components/tasks/transactionStatus"
import  AddTaskModal from "@/components/tasks/addTaskModal"
import { useTasks } from "@/hooks/useTask"
import { useContract } from "@/hooks/useContract"
import Footer from "@/components/layout/footer"

const Home = () => {
const taskOp = useTasks()
const { isConnected, transactionState } = useContract()

  return (
    <div className="flex flex-col h-screen">
      <Header onMenuClick={() => taskOp.setSidebarOpen(!taskOp.sidebarOpen)} />
        <div className="flex h-svh">
          <Sidebar
          categories={taskOp.userCategories}
          activeCategory={taskOp.activeCategoryId}
          onCategorySelect={taskOp.setActiveCategoryId}
          onAddCategory={taskOp.addCategory}
          isOpen={taskOp.sidebarOpen}
          onClose={() => taskOp.setSidebarOpen(false)}
        />
        {/* TODO: Need to check isLoading and isConnected, whether they are correctly set or not */}
        <MainDashboard
          tasks={taskOp.filteredTasks}
          allTags={taskOp.allTags}
          selectedTags={taskOp.selectedTags}
          onTagSelect={taskOp.setSelectedTags}
          onTaskUpdate={taskOp.updateTask}
          onTaskDelete={taskOp.deleteTask}
          onAddTaskClick={() => taskOp.setAddTaskOpen(true)}
          isLoading={taskOp.isLoading}
          isConnected={isConnected}
          categories={taskOp.categories}
        />
        </div>

        <AddTaskModal
        isOpen={taskOp.isAddTaskOpen}
        onClose={() => taskOp.setAddTaskOpen(false)}
        onAddTask={taskOp.addTask}
        categories={taskOp.categories}
        existingTags={taskOp.allTags}
        isCreating={transactionState.isLoading}
      />

      <TransactionStatus
        isLoading={transactionState.isLoading}
        txHash={transactionState.txHash}
        error={transactionState.error}
      />
      <div className="mt-auto">
      <Footer />
      </div>
    </div>
  )
}

export default Home