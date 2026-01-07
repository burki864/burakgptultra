"use client"


import { useState } from "react"


export function ChatInterface() {
const [messages, setMessages] = useState<any[]>([])
const [input, setInput] = useState("")
const username = "guest"


async function send() {
const res = await fetch("/api/chat", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ username, message: input })
})


const data = await res.json()
setMessages([...messages, { user: input, bot: data }])
setInput("")
}


return (
<div className="max-w-3xl mx-auto p-4">
<h1 className="text-2xl font-bold mb-4">BurakGPT</h1>
<div className="space-y-3">
{messages.map((m, i) => (
<div key={i}>
<div className="text-sm opacity-70">Sen:</div>
<div>{m.user}</div>
<div className="text-sm opacity-70 mt-2">BurakGPT:</div>
{m.bot.type === "image" ? (
<img src={m.bot.content} className="rounded-xl" />
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
className="flex-1 bg-input p-2 rounded"
/>
<button onClick={send} className="bg-primary text-black px-4 rounded">Gönder</button>
</div>
</div>
)
}
