"use client"

import { useState } from "react"
import { Button } from "@/components/common/button"
import { Input } from "@/components/common/input"
import { Sheet, SheetContent } from "@/components/common/sheet"
import { Badge } from "@/components/common/badge"
import { Plus, X } from "lucide-react"
import type { Category, NewCategory } from "@/types"

interface SidebarProps {
  categories: Omit<Category, "owner">[]
  activeCategory?: string
  onCategorySelect: (categoryId: string) => void
  onAddCategory: (category:NewCategory) => Promise<void>
  isOpen: boolean
  onClose: () => void
}

const Sidebar=({
  categories,
  activeCategory,
  onCategorySelect,
  onAddCategory,
  isOpen,
  onClose,
}: SidebarProps)=> {
  const [showAddCategory, setShowAddCategory] = useState(false)
  var categoryInput="";

  const handleAddCategory = () => {
    if (categoryInput.trim()) {
      // ToDo: we entering category color as hardcoded, need to be make as per chosen.
      onAddCategory({name:categoryInput.trim(), color:"red"})
      categoryInput="";
      setShowAddCategory(false)
    }
  }
  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="border-b-1 border-border mb-4 py-4">
        <h2 className="text-lg font-semibold text-center ">Categories</h2>
      </div>

      <nav className="flex-1 space-y-1 px-4">
        {categories.length===0?
        (<div className="text-center text-sm w-full">No categories available</div>):
        categories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "secondary" : "ghost"}
            className="w-full justify-between"
            onClick={() => {
              onCategorySelect(category.id)
              onClose()
            }}
          >
            <span>{category.name}</span>
            <Badge variant="outline" className="ml-auto">
              {category.count}
            </Badge>
          </Button>
        ))}
      </nav>

      <div className="p-4">
        {showAddCategory ? (
          <div className="space-y-2">
            <Input
              placeholder="Category name"
              defaultValue={categoryInput}
              onChange={(e) => categoryInput=e.target.value}
              onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddCategory}>
                Add
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  categoryInput=""
                  setShowAddCategory(false)
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="outline" className="w-full bg-transparent" onClick={() => setShowAddCategory(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:bg-muted/10">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  )
}

export default Sidebar;
