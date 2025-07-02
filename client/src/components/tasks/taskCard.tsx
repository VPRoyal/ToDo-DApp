"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/common/card"
import { Button } from "@/components/common/button"
import { Badge } from "@/components/common/badge"
import { Checkbox } from "@/components/common/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/common/dropdown-menu"
import { Calendar, Edit, MoreVertical, Trash2 } from "lucide-react"
import type { Category, Task, UpdateTaskPayload } from "@/types"

interface TaskCardProps {
  task: Task
  category: Category
  onUpdate: (payload: UpdateTaskPayload) => Promise<void>
  onDelete: (taskId: string) => void
}

export function TaskCard({ task, onUpdate, onDelete, category }: TaskCardProps) {
  const [isCompleting, setIsCompleting] = useState(false)

  const handleToggleComplete = async () => {
    setIsCompleting(true)
    // Simulate blockchain transaction delay
     await onUpdate({id:task.id, status:"COMPLETED"})
      setIsCompleting(false)
  }

  const formatDate = (dateString: BigInt) => {
    return new Date(Number(dateString)).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }
  const isCompleted= (task.status==="COMPLETED")
  const isOverdue = (new Date(Number(task.dueDate)) < new Date() )&& !isCompleted

  return (
    <Card
      className={`transition-all hover:shadow-md ${isCompleted ? "opacity-75" : ""} ${isOverdue ? "border-destructive" : ""}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <Checkbox
              checked={isCompleted}
              onCheckedChange={handleToggleComplete}
              disabled={isCompleting}
              className="mt-1"
            />
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold ${isCompleted ? "line-through text-muted-foreground" : ""}`}>
                {task.content}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={() => onDelete(task.id)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline" className="text-xs">
            {category.name}
          </Badge>
          {task.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span className={isOverdue ? "text-destructive font-medium" : ""}>{formatDate(task.dueDate)}</span>
          {isOverdue && (
            <Badge variant="destructive" className="text-xs">
              Overdue
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
