import {lazy, Suspense} from "react"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import TransactionStatus from "@/components/tasks/transactionStatus"
import  AddTaskModal from "@/components/tasks/addTaskModal"
import { useTasks } from "@/hooks/useTask"
import { useContract } from "@/hooks/useContract"
import LoadingSpinner from "@/components/common/loadingSpinner"

const Sidebar = lazy(() => import("@/components/layout/sidebar"))
const MainDashboard = lazy(() => import("@/components/layout/mainDashboard"))

const Home = () => {
const taskOp = useTasks()
const { isConnected, transactionState } = useContract()

  return (
    <div className="flex flex-col h-screen">
      <Header onMenuClick={() => taskOp.setSidebarOpen(!taskOp.sidebarOpen)} />
        <div className="flex h-svh">
          <Suspense fallback={<LoadingSpinner/>}>
          <Sidebar
          categories={taskOp.userCategories}
          activeCategory={taskOp.activeCategoryId}
          onCategorySelect={taskOp.setActiveCategoryId}
          onAddCategory={taskOp.addCategory}
          isOpen={taskOp.sidebarOpen}
          onClose={() => taskOp.setSidebarOpen(false)}
        />
        </Suspense>
        {/* TODO: Need to check isLoading and isConnected, whether they are correctly set or not */}
        <Suspense fallback={<LoadingSpinner/>}>
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
        </Suspense>
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