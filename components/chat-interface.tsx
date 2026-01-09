"use client"

import { useState } from "react"

type Message = {
  role: "user" | "bot"
  type: "text" | "image"
  content: string
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  async function send() {
    if (!input.trim() || loading) return

    const userMessage = input
    setInput("")
    setLoading(true)

    // 👤 kullanıcı mesajı
    setMessages(prev => [
      ...prev,
      { role: "user", type: "text", content: userMessage }
    ])

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: "burak", // ister auth'tan al
          message: userMessage
        })
      })

      if (!res.ok) throw new Error("API error")

      const data = await res.json()

      // 🤖 GERÇEK BACKEND CEVABI
      setMessages(prev => [
        ...prev,
        {
          role: "bot",
          type: data.type,
          content: data.content
        }
      ])
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: "bot",
          type: "text",
          content: "❌ Backend’e ulaşılamadı"
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">BurakGPT</h1>

      <div className="space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl ${
              m.role === "user"
                ? "bg-blue-500/20 text-right"
                : "bg-card"
            }`}
          >
            <div className="text-xs opacity-70 mb-1">
              {m.role === "user" ? "Sen" : "BurakGPT"}
            </div>

            {/* TEXT */}
            {m.type === "text" && <div>{m.content}</div>}

            {/* IMAGE */}
            {m.type === "image" && (
              <img
                src={m.content}
                alt="AI Görsel"
                className="rounded-lg max-w-full"
              />
            )}
          </div>
        ))}

        {loading && (
          <div className="text-sm opacity-60">
            BurakGPT düşünüyor…
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-4">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          className="flex-1 bg-input p-2 rounded"
          placeholder="Mesaj yaz…"
        />
        <button
          onClick={send}
          disabled={loading}
          className="bg-primary text-black px-4 rounded"
        >
          Gönder
        </button>
      </div>
    </div>
  )
}
