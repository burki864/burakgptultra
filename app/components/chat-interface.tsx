"use client"

import { useState } from "react"

type Message = {
  user: string
  bot: {
    type: "text" | "image"
    content: string
  }
}

// 🔴 BURASI KRİTİK
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://burakgpt.onrender.com"

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const username = "guest"

  async function send() {
    if (!input.trim() || loading) return

    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          message: input
        })
      })

      if (!res.ok) {
        throw new Error("API hata verdi")
      }

      const data = await res.json()

      setMessages(prev => [
        ...prev,
        {
          user: input,
          bot: data
        }
      ])

      setInput("")
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          user: input,
          bot: {
            type: "text",
            content: "⚠️ Sunucuya ulaşılamadı"
          }
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">BurakGPT</h1>

      <div className="space-y-4">
        {messages.map((m, i) => (
          <div key={i} className="bg-card p-3 rounded-xl">
            <div className="text-xs opacity-70 mb-1">Sen</div>
            <div className="mb-2">{m.user}</div>

            <div className="text-xs opacity-70 mb-1">BurakGPT</div>

            {m.bot.type === "image" ? (
              <img
                src={m.bot.content}
                className="rounded-xl max-w-full"
                width={320}
              />
            ) : (
              <div>{m.bot.content}</div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-4">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          className="flex-1 bg-input p-2 rounded"
          placeholder="Mesaj yaz..."
        />
        <button
          onClick={send}
          disabled={loading}
          className="bg-primary text-black px-4 rounded"
        >
          {loading ? "..." : "Gönder"}
        </button>
      </div>
    </div>
  )
}
