"use client"

import Image from "next/image"
import { Code, Lightbulb, FileText } from "lucide-react"

interface WelcomeScreenProps {
  onSuggestionClick: (content: string) => void
}

const suggestions = [
  {
    icon: Code,
    title: "Kod yaz",
    description: "Bir React / frontend bileşeni yaz",
  },
  {
    icon: Lightbulb,
    title: "Fikir üret",
    description: "Yaratıcı fikirler ve çözümler öner",
  },
  {
    icon: FileText,
    title: "Metin özetle",
    description: "Uzun yazıları kısa ve net özetle",
  },
]

export function WelcomeScreen({ onSuggestionClick }: WelcomeScreenProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-4 pb-32">
      {/* LOGO */}
      <div className="mb-8 flex size-16 items-center justify-center rounded-2xl bg-accent/10">
        <Image
          src="/logo.png"
          alt="BurakGPT"
          width={40}
          height={40}
          priority
        />
      </div>

      {/* BAŞLIK */}
      <h1 className="mb-3 text-center text-3xl font-semibold tracking-tight text-balance">
        BurakGPT’ye hoş geldin
      </h1>

      {/* AÇIKLAMA */}
      <p className="mb-12 max-w-md text-center text-muted-foreground text-balance">
        Ben BurakGPT. Sorunu yaz, kod iste, fikir al ya da sohbet et.
      </p>

      {/* ÖNERİ KARTLARI */}
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
              <h3 className="font-medium text-foreground">
                {suggestion.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {suggestion.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
