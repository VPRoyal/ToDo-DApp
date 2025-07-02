// src/hooks/useTaskOperations.ts
import { useState, useCallback } from "react"
import { toast } from "react-hot-toast"
import { useWallet } from "@/context/walletProvider"
import { useContract } from "@/hooks/useContract"
import type { Task, NewTask, UpdateTaskPayload, Category, NewCategory } from "@/types"

const EXPLORER_BASE = import.meta.env.REACT_APP_EXPLORER_BASE_URL || "https://etherscan.io"

export const useTaskOperations=()=> {
  const { account } = useWallet()
  const {
    getUserTasks,
    createTask: createOnChain,
    updateTaskStatus,
    deleteTask: deleteOnChain,
    createCategory: createCategoryOnChain,
    getUserCategories,
    isConnected,
  } = useContract()

  const [tasks, setTasks] = useState<Task[]>([])
  const [categories, setCategories] =useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [updatingIds, setUpdatingIds] = useState<Record<string, boolean>>({})
  const [deletingIds, setDeletingIds] = useState<Record<string, boolean>>({})

  const loadTasks = useCallback(async () => {
    if (!isConnected || !account) {
      setTasks([])
      return
    }
    setIsLoading(true)
    try {
      const chainTasks = await getUserTasks()
      setTasks(chainTasks)
    } catch (e) {
      console.error(e)
      toast.error("Failed to load tasks")
    } finally {
      setIsLoading(false)
    }
  }, [account, getUserTasks, isConnected])

    // ToDo: Need to monitor if useCallback has any use in addCategory

  const addTask = useCallback(
    async (data: NewTask) => {
      if (!isConnected) {
        toast.error("Connect wallet first")
        return
      }
      setIsCreating(true)
      try {
        const tx = await createOnChain(data)
        toast.success(`Tx sent: ${tx.slice(0,8)}… View 👉 ${EXPLORER_BASE}/tx/${tx}`, { duration: 8000 })

        // toast.info(
        //   <span>
        //     TX sent:{" "}
        //     <a
        //       href={`${EXPLORER_BASE}/tx/${tx}`}
        //       target="_blank"
        //       rel="noopener noreferrer"
        //     >
        //       {tx.slice(0, 8)}…
        //     </a>
        //   </span>,
        //   { autoClose: 8000 }
        // )
        // optimistic: immediately reload after a delay
        setTimeout(loadTasks, 2000)
      } catch (e) {
        console.error(e)
        toast.error("Create failed")
      } finally {
        setIsCreating(false)
      }
    },
    [createOnChain, isConnected, loadTasks]
  )

  const updateTask = useCallback(
    async (payloads: UpdateTaskPayload) => {
      if (!isConnected) {
        toast.error("Connect wallet first")
        return
      }
      const {id, ...updates} = payloads
     setUpdatingIds((m) => ({ ...m, [id]: true }))

      // optimistic local
      const old = tasks.find((t) => t.id === id)
      if (old) setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, ...updates } : t)))
      try {
        if ("status" in updates) {
         await updateTaskStatus(id, updates.status!)
        }

        setTimeout(loadTasks, 2000)
      } catch (e) {
        console.error(e)
        toast.error("Update failed")
        // rollback
        if (old) setTasks((ts) => ts.map((t) => (t.id === id ? old : t)))
      } finally {
        setUpdatingIds((m) => {
          const nxt = { ...m }
          delete nxt[id]
          return nxt
        })
      }
    },
    [isConnected, tasks, updateTaskStatus, loadTasks]
  )

  const deleteTask = useCallback(
    async (id: string) => {
      if (!isConnected) {
        toast.error("Connect wallet first")
        return
      }
      setDeletingIds((m) => ({ ...m, [id]: true }))
      // optimistic remove
      const oldList = tasks.slice()
      setTasks((ts) => ts.filter((t) => t.id !== id))
      try {
        await deleteOnChain(id)
        setTimeout(loadTasks, 2000)
      } catch (e) {
        console.error(e)
        toast.error("Delete failed")
        // rollback
        setTasks(oldList)
      } finally {
        setDeletingIds((m) => {
          const nxt = { ...m }
          delete nxt[id]
          return nxt
        })
      }
    },
    [deleteOnChain, isConnected, loadTasks, tasks]
  )

  const loadCategories =useCallback(async () => {
    if (!isConnected || !account) {
      setCategories([])
      return
    }
    setIsLoading(true)
    try {
      const chainCatgories = await getUserCategories()
      setCategories(chainCatgories)
    } catch (e) {
      console.error(e)
      toast.error("Failed to load tasks")
    } finally {
      setIsLoading(false)
    }
  }, [account, getUserCategories, isConnected])

  // ToDo: Need to monitor if useCallback has any use in addCategory
  const addCategory= useCallback(
    async (data: NewCategory) => {
      if (!isConnected) {
        toast.error("Connect wallet first")
        return
      }
      setIsCreating(true)
      try {
        console.log("Adding Category")
        const tx = await createCategoryOnChain(data)
        toast.success(`Tx sent: ${tx.slice(0,8)}… View 👉 ${EXPLORER_BASE}/tx/${tx}`, { duration: 8000 })

        // toast.info(
        //   <span>
        //     TX sent:{" "}
        //     <a
        //       href={`${EXPLORER_BASE}/tx/${tx}`}
        //       target="_blank"
        //       rel="noopener noreferrer"
        //     >
        //       {tx.slice(0, 8)}…
        //     </a>
        //   </span>,
        //   { autoClose: 8000 }
        // )
        // optimistic: immediately reload after a delay
        setTimeout(loadCategories, 2000)
      } catch (e) {
        console.error(e)
        toast.error("Create failed")
      } finally {
        setIsCreating(false)
      }
    },
    [createCategoryOnChain, isConnected, loadCategories]
  )

  return {
    tasks,
    isLoading,
    isCreating,
    updatingIds,
    deletingIds,
    categories,
    loadTasks,
    addTask,
    addCategory,
    loadCategories,
    updateTask,
    deleteTask,
  }
}