"use client"

import { Sparkles, Code, Lightbulb, FileText } from "lucide-react"

interface WelcomeScreenProps {
  onSuggestionClick: (content: string) => void
}

const suggestions = [
  {
    icon: Code,
    title: "Write code",
    description: "Help me build a React component",
  },
  {
    icon: Lightbulb,
    title: "Brainstorm ideas",
    description: "Generate creative solutions",
  },
  {
    icon: FileText,
    title: "Summarize text",
    description: "Condense long documents",
  },
]

export function WelcomeScreen({ onSuggestionClick }: WelcomeScreenProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-4 pb-32">
      <div className="mb-8 flex size-16 items-center justify-center rounded-2xl bg-accent/10">
        <Sparkles className="size-8 text-accent" />
      </div>

      <h1 className="mb-3 text-center text-3xl font-semibold tracking-tight text-balance">How can I help you today?</h1>
      <p className="mb-12 max-w-md text-center text-muted-foreground text-balance">
        I'm Nova, your AI assistant. Ask me anything or choose a suggestion below.
      </p>

      <div className="grid w-full max-w-2xl gap-3 sm:grid-cols-3">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.title}
            onClick={() => onSuggestionClick(suggestion.description)}
            className="group flex flex-col items-start gap-3 rounded-xl border border-border/50 bg-card/50 p-4 text-left transition-all hover:border-accent/50 hover:bg-card"
          >
            <div className="flex size-10 items-center justify-center rounded-lg bg-secondary transition-colors group-hover:bg-accent/20">
              <suggestion.icon className="size-5 text-muted-foreground transition-colors group-hover:text-accent" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">{suggestion.title}</h3>
              <p className="text-sm text-muted-foreground">{suggestion.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
