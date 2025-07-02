// src/hooks/useTaskFilters.ts
import { useState, useMemo, useEffect } from "react"
import { type Task, type Category } from "@/types"

export function useTaskFilters(tasks: Task[], categories: Category[]) {
  const [userCategories, setUserCategories] = useState<Category[]>([])
  const [activeCategoryId, setActiveCategoryId] = useState<string>()
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // recalc counts whenever tasks change
useEffect(() => {
  if (!categories.length) return
  const categoryTaskMap = tasks.reduce<Map<string, number>>((map, task) => {
    if (!task.isDeleted) {
      map.set(task.categoryId, (map.get(task.categoryId) || 0) + 1)
    }
    return map
  }, new Map())


  const updatedCategories: Category[] = categories.map(category => ({
    ...category,
    count: categoryTaskMap.get(category.id) || 0,
  }))
  setUserCategories(updatedCategories)
}, [tasks, categories])


  const allTags = useMemo(
    () => Array.from(new Set(tasks.flatMap((t) => t.tags))),
    [tasks]
  )

  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) => {
        const catMatch =!activeCategoryId || task.categoryId===activeCategoryId;
        const tagMatch =
          selectedTags.length === 0 ||
          selectedTags.some((tag) => task.tags.includes(tag))
        return catMatch && tagMatch
      }),
    [tasks, activeCategoryId, selectedTags]
  )


  return {
    userCategories,
    activeCategoryId,
    setActiveCategoryId,
    selectedTags,
    setSelectedTags,
    allTags,
    filteredTasks,
  }
}