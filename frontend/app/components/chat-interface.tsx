"use client"

import { useState } from "react"

type BotMessage = {
  type: "text" | "image"
  content: string
}

type Message = {
  user: string
  bot: BotMessage
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const username = "guest"

  async function send() {
    if (!input.trim() || loading) return

    const userMessage = input
    setInput("")
    setLoading(true)

    // 👑 Kullanıcı mesajı anında eklenir
    setMessages(prev => [
      ...prev,
      {
        user: userMessage,
        bot: {
          type: "text",
          content: "..."
        }
      }
    ])

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          message: userMessage
        })
      })

      if (!res.ok) {
        throw new Error("API hata verdi")
      }

      const data = await res.json()

      const botReply: BotMessage = {
        type: data?.type === "image" ? "image" : "text",
        content: data?.content || "⚠️ Boş cevap geldi"
      }

      // 👑 Son mesajın bot kısmı güncellenir
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          user: userMessage,
          bot: botReply
        }
        return updated
      })
    } catch (err) {
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          user: userMessage,
          bot: {
            type: "text",
            content: "⚠️ Sunucuya ulaşılamadı"
          }
        }
        return updated
      })
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
                alt="AI görseli"
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
