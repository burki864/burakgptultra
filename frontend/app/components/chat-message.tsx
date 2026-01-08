"use client"

import { cn } from "@/lib/utils"
import { User, Sparkles, Copy, Check } from "lucide-react"
import { useState } from "react"
import type { Message } from "./chat-interface"

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)

  // ✅ OpenAI + local model standardı
  const isUser = message.role === "user"
  const isAssistant = message.role === "assistant"

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn("group flex items-start gap-4", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-lg",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-accent/20"
        )}
      >
        {isUser ? (
          <User className="size-4" />
        ) : (
          <Sparkles className="size-4 text-accent" />
        )}
      </div>

      <div className={cn("flex-1 space-y-2", isUser && "flex justify-end")}>
        <div
          className={cn(
            "relative rounded-2xl px-4 py-3 text-sm leading-relaxed",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-card text-card-foreground"
          )}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>

          {isAssistant && (
            <button
              onClick={handleCopy}
              className="absolute -bottom-8 left-0 flex items-center gap-1.5 text-xs text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
            >
              {copied ? (
                <>
                  <Check className="size-3.5" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  Copy
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
