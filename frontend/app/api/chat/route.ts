import { NextResponse } from "next/server"
import OpenAI from "openai"

/* =========================
   AYARLAR
========================= */

// true  → local model (FastAPI / llama.cpp)
// false → OpenAI
const USE_LOCAL_MODEL = false

// local model endpoint
const LOCAL_API_URL = "http://127.0.0.1:8000/chat"

// OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/* =========================
   HAFIZA (KETÇAP 🍅)
========================= */

// şimdilik RAM hafıza
// server restart → sıfırlanır (bilerek böyle)
let memory: {
  role: "system" | "user" | "assistant"
  content: string
}[] = [
  {
    role: "system",
    content:
      "You are BurakGPT. You are helpful, short, clear, and friendly. You remember previous messages in the conversation.",
  },
]

/* =========================
   POST
========================= */

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const userMessage: string = body.message

    if (!userMessage) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      )
    }

    // kullanıcı mesajını hafızaya ekle
    memory.push({
      role: "user",
      content: userMessage,
    })

    let assistantReply = ""

    /* =========================
       LOCAL MODEL
    ========================= */
    if (USE_LOCAL_MODEL) {
      const localRes = await fetch(LOCAL_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: memory,
        }),
      })

      const localData = await localRes.json()
      assistantReply = localData.reply ?? "Local model cevap vermedi."

    /* =========================
       OPENAI
    ========================= */
    } else {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: memory,
        temperature: 0.7,
      })

      assistantReply =
        completion.choices[0]?.message?.content ??
        "OpenAI cevap veremedi."
    }

    // bot cevabını hafızaya ekle
    memory.push({
      role: "assistant",
      content: assistantReply,
    })

    return NextResponse.json({
      reply: assistantReply,
      memoryCount: memory.length,
      engine: USE_LOCAL_MODEL ? "local" : "openai",
    })
  } catch (err) {
    console.error("CHAT API ERROR:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
