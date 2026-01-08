"use client"

import { Button } from "../components/ui/button"
import { Plus, Menu, Sparkles } from "lucide-react"

interface ChatHeaderProps {
  onNewChat: () => void
  onToggleMenu: () => void
}

export function ChatHeader({ onNewChat, onToggleMenu }: ChatHeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b bg-background/80 px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onToggleMenu}>
          <Menu className="size-5" />
        </Button>

        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-accent/20">
            <Sparkles className="size-4 text-accent" />
          </div>
          <span className="text-lg font-semibold">BurakGPT</span>
        </div>
      </div>

      <Button variant="ghost" onClick={onNewChat} className="gap-2">
        <Plus className="size-4" />
        <span className="hidden sm:inline">Yeni sohbet</span>
      </Button>
    </header>
  )
}
