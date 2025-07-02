"use client"

import { Button } from "@/components/common/button"
import { Badge } from "@/components/common/badge"
import { X } from "lucide-react"

interface TagFilterProps {
  allTags: string[]
  selectedTags: string[]
  onTagSelect: (tags: string[]) => void
}

export function TagFilter({ allTags, selectedTags, onTagSelect }: TagFilterProps) {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagSelect(selectedTags.filter((t) => t !== tag))
    } else {
      onTagSelect([...selectedTags, tag])
    }
  }

  const clearAllTags = () => {
    onTagSelect([])
  }

  if (allTags.length === 0) return null

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Filter by Tags</h3>
        {selectedTags.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAllTags} className="h-auto p-1 text-xs">
            <X className="mr-1 h-3 w-3" />
            Clear all
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => {
          const isSelected = selectedTags.includes(tag)
          return (
            <Badge
              key={tag}
              variant={isSelected ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/80"
              onClick={() => toggleTag(tag)}
            >
              {tag}
              {isSelected && <X className="ml-1 h-3 w-3" />}
            </Badge>
          )
        })}
      </div>
    </div>
  )
}
