// src/hooks/useTasks.ts
import { useEffect } from "react"
import { useTaskOperations } from "./useTaskOperations"
import { useTaskFilters } from "./useTaskFilters"
import { useTaskUI } from "./useTaskUI"

export const useTasks=()=> {
  const ops = useTaskOperations()
  const filters = useTaskFilters(ops.tasks, ops.categories)
  const ui   = useTaskUI()

  // reload when wallet changes
  useEffect(() => {
    ops.loadTasks()
    ops.loadCategories()
  }, [ops.loadTasks, ops.loadCategories])

  return {
    ...ops,
    ...filters,
    ...ui,
  }
}