// src/hooks/useTaskUI.ts
import { useState } from "react"

export function useTaskUI() {
  const [isAddTaskOpen, setAddTaskOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return {
    isAddTaskOpen,
    setAddTaskOpen,
    sidebarOpen,
    setSidebarOpen,
  }
}