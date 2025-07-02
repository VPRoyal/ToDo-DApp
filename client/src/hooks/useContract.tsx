"use client";

import { useState, useCallback } from "react";
import { ethers } from "ethers";
import { useWallet } from "@/context/walletProvider";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/contract";
import { toast } from "react-hot-toast";
import type { Task, NewTask, TaskStatus, Category, NewCategory, TransactionState, Priority } from "@/types";
import { PriorityMap, TaskStatusMap, ReversePriorityMap, ReversePTaskStatusMap } from "@/types";



export const useContract = () => {
  const { account } = useWallet();
  const [transactionState, setTransactionState] = useState<TransactionState>({
    isLoading: false,
    txHash: null,
    error: null,
  });

  const getContract = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum || !account) {
      throw new Error("Wallet not connected");
    }
    console.log("Using account:", account);
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  }, [account]);

  const getReadOnlyContract = useCallback(() => {
    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("Ethereum provider not available");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
  }, []);

  const formatTask = (task: any): Task => {
    return {
      id: task[0].toString(),
      content: task[1],
      description: task[2],
      status: ReversePTaskStatusMap[task[3]],
      priority:ReversePriorityMap[task[4]],
      dueDate: task[5],
      createdAt: task[6],
      updatedAt: task[7],
      owner: task[8],
      isDeleted: task[9],
      tags: task[10],
      categoryId: task[11].toString(),
    };

    
  };
  const formatCategory = (category: any): Category => {
  return {
    id: category[0].toString(),
    name: category[1],
    color: category[2],
    owner: BigInt(category[3]), // Ensure it's a BigInt if not already
    count: 0, // default task count
  }
}

  const createTask = useCallback(
    async (task: NewTask) => {
      if (!account) {
        toast.error("Please connect your wallet first");
        return null;
      }

      setTransactionState({ isLoading: true, txHash: null, error: null });

      try {
        const contract = await getContract();

        const taskPriority=PriorityMap[task.priority as Priority]
        // Estimate gas
        const gasEstimate = await contract.createTask.estimateGas(
          task.content,
          task.description,
          taskPriority,
          task.dueDate,
          BigInt(task.categoryId),
          task.tags
        );

        // Add 20% buffer to gas estimate
        const gasLimit = (gasEstimate * BigInt(120)) / BigInt(100);

        const tx = await contract.createTask(
          task.content,
          task.description,
          taskPriority,
          task.dueDate,
          BigInt(task.categoryId),
          task.tags,
          {
            gasLimit,
          }
        );

        setTransactionState({ isLoading: true, txHash: tx.hash, error: null });
        toast.success("Transaction submitted! Waiting for confirmation...");

        const receipt = await tx.wait();

        if (receipt.status === 1) {
          toast.success("Task created successfully on blockchain!");
          setTransactionState({
            isLoading: false,
            txHash: tx.hash,
            error: null,
          });
          return tx.hash;
        } else {
          throw new Error("Transaction failed");
        }
      } catch (error: any) {
        console.error("Error creating task:", error);
        const errorMessage =
          error.reason || error.message || "Failed to create task";
        setTransactionState({
          isLoading: false,
          txHash: null,
          error: errorMessage,
        });
        toast.error(errorMessage);
        return null;
      }
    },
    [account, getContract]
  );

  const updateTaskStatus = useCallback(
    async (taskId: string, status: TaskStatus) => {
      if (!account) {
        toast.error("Please connect your wallet first");
        return false;
      }

      setTransactionState({ isLoading: true, txHash: null, error: null });

      try {
        const contract = await getContract();
        const taskStatus=TaskStatusMap[status as TaskStatus]
        const gasEstimate = await contract.updateTaskStatus.estimateGas(
          taskId,
          taskStatus
        );
        const gasLimit = (gasEstimate * BigInt(120)) / BigInt(100);

        const tx = await contract.updateTaskStatus(BigInt(taskId) , taskStatus, {
          gasLimit,
        });

        setTransactionState({ isLoading: true, txHash: tx.hash, error: null });
        toast.success("Transaction submitted! Waiting for confirmation...");

        const receipt = await tx.wait();
        // ToDo: Need to update return parameter for status update function in smart contract.
        if (receipt.status===1) {
          toast.success(
            `Task ${status} successfully!`
          );
          setTransactionState({
            isLoading: false,
            txHash: tx.hash,
            error: null,
          });
          return true;
        } else {
          throw new Error("Transaction failed");
        }
      } catch (error: any) {
        console.error("Error updating task:", error);
        const errorMessage =
          error.reason || error.message || "Failed to update task";
        setTransactionState({
          isLoading: false,
          txHash: null,
          error: errorMessage,
        });
        toast.error(errorMessage);
        return false;
      }
    },
    [account, getContract]
  );

  const deleteTask = useCallback(
    async (taskId: string) => {
      if (!account) {
        toast.error("Please connect your wallet first");
        return false;
      }

      setTransactionState({ isLoading: true, txHash: null, error: null });

      try {
        const contract = await getContract();

        const gasEstimate = await contract.deleteTask.estimateGas(taskId);
        const gasLimit = (gasEstimate * BigInt(120)) / BigInt(100);

        const tx = await contract.deleteTask(BigInt(taskId), { gasLimit });

        setTransactionState({ isLoading: true, txHash: tx.hash, error: null });
        toast.success("Transaction submitted! Waiting for confirmation...");

        const receipt = await tx.wait();

        if (receipt.status === 1) {
          toast.success("Task deleted successfully!");
          setTransactionState({
            isLoading: false,
            txHash: tx.hash,
            error: null,
          });
          return true;
        } else {
          throw new Error("Transaction failed");
        }
      } catch (error: any) {
        console.error("Error deleting task:", error);
        const errorMessage =
          error.reason || error.message || "Failed to delete task";
        setTransactionState({
          isLoading: false,
          txHash: null,
          error: errorMessage,
        });
        toast.error(errorMessage);
        return false;
      }
    },
    [account, getContract]
  );

  const getUserTasks = useCallback(async (): Promise<Task[]> => {
    if (!account) return [];

    try {
      const contract = getReadOnlyContract();
      const contractTasks = await contract.getUserTasks();

      return contractTasks.map((task: any) => formatTask(task));
    } catch (error: any) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch tasks from blockchain");
      return [];
    }
  }, [account, getReadOnlyContract]);

  // const getTasksByCategory = useCallback(
  //   async (category: string): Promise<Task[]> => {
  //     if (!account) return [];

  //     try {
  //       const contract = getReadOnlyContract();
  //       const contractTasks = await contract.getTasksByCategory(
  //         account,
  //         category
  //       );

  //       return contractTasks.map((task: Task) =>
  //         convertContractTaskToTask(task)
  //       );
  //     } catch (error: any) {
  //       console.error("Error fetching tasks by category:", error);
  //       return [];
  //     }
  //   },
  //   [account, getReadOnlyContract]
  // );

  // const getCompletedTasks = useCallback(async (): Promise<Task[]> => {
  //   if (!account) return [];

  //   try {
  //     const contract = getReadOnlyContract();
  //     const contractTasks = await contract.getCompletedTasks(account);

  //     return contractTasks.map((task: Task) =>
  //       formatTask(task)
  //     );
  //   } catch (error: any) {
  //     console.error("Error fetching completed tasks:", error);
  //     return [];
  //   }
  // }, [account, getReadOnlyContract]);

  const createCategory = useCallback(
    async (category: NewCategory) => {
      if (!account) {
        toast.error("Please connect your wallet first");
        return null;
      }
      console.log("Creating the category....")

      setTransactionState({ isLoading: true, txHash: null, error: null });

      try {
        const contract = await getContract();

        // Estimate gas
        const gasEstimate = await contract.createCategory.estimateGas(
          category.name,
          category.color
        );

        // Add 20% buffer to gas estimate
        const gasLimit = (gasEstimate * BigInt(120)) / BigInt(100);

        const tx = await contract.createCategory(
          category.name,
          category.color,
          {
            gasLimit,
          }
        );

        setTransactionState({ isLoading: true, txHash: tx.hash, error: null });
        toast.success("Transaction submitted! Waiting for confirmation...");

        const receipt = await tx.wait();

        if (receipt.status === 1) {
          toast.success("Category created successfully on blockchain!");
          setTransactionState({
            isLoading: false,
            txHash: tx.hash,
            error: null,
          });
          return tx.hash;
        } else {
          throw new Error("Transaction failed");
        }
      } catch (error: any) {
        console.error("Error creating Category:", error);
        const errorMessage =
          error.reason || error.message || "Failed to create task";
        setTransactionState({
          isLoading: false,
          txHash: null,
          error: errorMessage,
        });
        toast.error(errorMessage);
        return null;
      }
    },
    [account, getContract]
  );

const getUserCategories = useCallback(async (): Promise<Category[]> => {
    if (!account) return [];

    try {
      const contract = getReadOnlyContract();
      const contractCategories = await contract.getUserCategories();
      return contractCategories.map((category: any) => formatCategory(category));
    } catch (error: any) {
      console.error("Error fetching Categories:", error);
      toast.error("Failed to fetch Categories from blockchain");
      return [];
    }
  }, [account, getReadOnlyContract]);

  return {
    createTask,
    updateTaskStatus,
    deleteTask,
    getUserTasks,
    // getTasksByCategory,
    createCategory,
    getUserCategories,
    // getCompletedTasks,
    transactionState,
    isConnected: !!account,
  };
};
