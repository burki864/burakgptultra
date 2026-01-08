"use client"

import { Button } from "@/components/ui/button"
import { Plus, Menu, Sparkles } from "lucide-react"

interface ChatHeaderProps {
  onNewChat: () => void
}

export function ChatHeader({ onNewChat }: ChatHeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border/50 bg-background/80 px-4 py-3 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="size-9 text-muted-foreground hover:text-foreground">
          <Menu className="size-5" />
          <span className="sr-only">Menu</span>
        </Button>
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-accent/20">
            <Sparkles className="size-4 text-accent" />
          </div>
          <span className="text-lg font-semibold tracking-tight">Nova</span>
        </div>
      </div>

      <Button
        onClick={onNewChat}
        variant="ghost"
        size="sm"
        className="gap-2 text-muted-foreground hover:text-foreground"
      >
        <Plus className="size-4" />
        <span className="hidden sm:inline">New chat</span>
      </Button>
    </header>
  )
}
