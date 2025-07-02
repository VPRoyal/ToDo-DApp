"use client"

import { TaskCard } from "@/components/tasks/taskCard"
import { TagFilter } from "@/components/tasks/tagFilter"
import { StatsPanel } from "@/components/tasks/statsPanel"
import { Button } from "@/components/common/button"
import { Plus } from "lucide-react"
import type { Category, Task, UpdateTaskPayload } from "@/types"
import { Wallet, Loader2 } from "lucide-react"

interface MainDashboardProps {
  tasks: Task[]
  categories: Category[]
  allTags: string[]
  selectedTags: string[]
  onTagSelect: (tags: string[]) => void
  onTaskUpdate: (payload: UpdateTaskPayload) => Promise<void>
  onTaskDelete: (taskId: string) => void
  onAddTaskClick: () => void
  isLoading?: boolean
  isConnected?: boolean
}

const MainDashboard=({
  tasks,
  categories,
  allTags,
  selectedTags,
  onTagSelect,
  onTaskUpdate,
  onTaskDelete,
  onAddTaskClick,
  isLoading = false,
  isConnected = false,
}: MainDashboardProps)=> {
  const categoryMap = new Map<string, Category>(categories.map(cat => [cat.id, cat]))
  const completedTasks = tasks.filter((task) => task.status=="COMPLETED").length
  const pendingTasks = tasks.filter((task) => task.status=="PENDING").length


  if (!isConnected) {
    return (
      <main className="flex-1 overflow-hidden">
        <div className="h-full p-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Wallet className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
            <p className="text-muted-foreground mb-4">Connect your wallet to start managing tasks on the blockchain</p>
          </div>
        </div>
      </main>
    )
  }

  if (isLoading) {
    return (
      <main className="flex-1 overflow-hidden">
        <div className="h-full p-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Loading Tasks</h3>
            <p className="text-muted-foreground">Fetching your tasks from the blockchain...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 overflow-hidden">
      <div className="h-full p-6">
        <div className="mb-6">
          <StatsPanel totalTasks={tasks.length} completedTasks={completedTasks} pendingTasks={pendingTasks} />
        </div>

        <div className="mb-6">
          <TagFilter allTags={allTags} selectedTags={selectedTags} onTagSelect={onTagSelect} />
        </div>

        <div className="space-y-4 pb-20">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-6 mb-4">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
              <p className="text-muted-foreground mb-4">Get started by creating your first task</p>
              <Button onClick={onAddTaskClick}>
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {tasks.map((task) => {
               return ( <TaskCard key={task.id} category={categoryMap.get(task.categoryId)!} task={task} onUpdate={onTaskUpdate} onDelete={onTaskDelete} />)
})}
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <Button className="fixed bottom-25 right-6 h-16 w-16 rounded-full shadow-lg" onClick={onAddTaskClick}>
        <Plus className="h-6 w-6" />
      </Button>
    </main>
  )
}
export default MainDashboard;
