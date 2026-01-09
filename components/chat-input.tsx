"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowUp, Paperclip, Mic } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  onSend: (content: string) => void
  isLoading: boolean
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [input])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      onSend(input.trim())
      setInput("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="sticky bottom-0 border-t border-border/50 bg-background/80 backdrop-blur-xl">
      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl p-4">
        <div className="relative flex items-end gap-2 rounded-2xl border border-border/50 bg-card p-2 shadow-lg transition-colors focus-within:border-accent/50">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-9 shrink-0 text-muted-foreground hover:text-foreground"
          >
            <Paperclip className="size-5" />
            <span className="sr-only">Attach file</span>
          </Button>

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Nova..."
            rows={1}
            className="max-h-[200px] min-h-[44px] flex-1 resize-none bg-transparent py-3 text-sm leading-relaxed placeholder:text-muted-foreground focus:outline-none"
          />

          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-9 shrink-0 text-muted-foreground hover:text-foreground"
            >
              <Mic className="size-5" />
              <span className="sr-only">Voice input</span>
            </Button>

            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
              className={cn(
                "size-9 shrink-0 rounded-xl transition-all",
                input.trim()
                  ? "bg-accent text-accent-foreground hover:bg-accent/90"
                  : "bg-secondary text-muted-foreground",
              )}
            >
              <ArrowUp className="size-5" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </div>

        <p className="mt-2 text-center text-xs text-muted-foreground">
          Nova may produce inaccurate information. Consider checking important facts.
        </p>
      </form>
    </div>
  )
}
