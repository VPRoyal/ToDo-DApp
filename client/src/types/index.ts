// src/types/index.ts

export const TaskStatusMap = {
  PENDING: 0,
  IN_PROGRESS: 1,
  COMPLETED: 2,
  ARCHIVED: 3,
} as const
export type TaskStatus = keyof typeof TaskStatusMap;
export const ReversePTaskStatusMap = Object.keys(TaskStatusMap) as TaskStatus[]


export const PriorityMap = {
  LOW: 0,
  MEDIUM: 1,
  HIGH: 2,
} as const
export type Priority = keyof typeof PriorityMap;
export const ReversePriorityMap = Object.keys(PriorityMap) as Priority[]
export interface Task {
  id: string
  content: string
  description: string
  status:TaskStatus
  priority: Priority
  dueDate: BigInt
  createdAt: BigInt
  updatedAt: BigInt
  owner: string
  isDeleted: boolean
  tags: string[]
  categoryId: string
}
export type NewTask = Omit<Task, "id" | "createdAt" | "updatedAt" | "owner" |"isDeleted">
export type TaskUpdate = Partial<Omit<Task, "id" | "createdAt">>;
export type UpdateTaskPayload = {
  id: string
} & Partial<Omit<Task, "id" | "createdAt">>

export interface Category {
  id: string
  name: string
  color: string
  owner: BigInt
  count: number
}

export type NewCategory = Omit<Category, "id" | "owner" | "count">


// Todo: need to remove "owner" field in catgory coming from contract
export const defaultCategories: Omit<Category, "owner">[] = [
  { id: "all", name: "All", count: 0, color:'red' },
  { id: "work", name: "Work", count: 0, color:'red' },
  { id: "personal", name: "Personal", count: 0 , color:'red'},
  { id: "urgent", name: "Urgent", count: 0, color:'red' },
  { id: "completed", name: "Completed", count: 0, color:'red' },
]

export interface Web3State {
  provider: any;
  signer: any;
  address: string | null;
  chainId: number | null;
}

export interface TransactionStatus {
  hash: string;
  status: 'pending' | 'success' | 'error';
  message?: string;
}

export interface TransactionState {
  isLoading: boolean;
  txHash: string | null;
  error: string | null;
}