import os
import requests
from datetime import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
from openai import OpenAI
from gradio_client import Client as GradioClient

# ======================
# ENV
# ======================

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

USE_LOCAL_LLM = os.getenv("USE_LOCAL_LLM", "false").lower() == "true"
LOCAL_LLM_URL = os.getenv("LOCAL_LLM_URL")

# ======================
# APP
# ======================

app = FastAPI(title="BurakGPT API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ======================
# CLIENTS
# ======================

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
openai_client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None
qwen_image = GradioClient("Qwen/Qwen-Image-2512")

# ======================
# MODELS
# ======================

class ChatRequest(BaseModel):
    username: str
    message: str

# ======================
# BAN CHECK
# ======================

def is_user_banned(username: str) -> bool:
    try:
        res = (
            supabase
            .table("users")
            .select("banned_until")
            .eq("username", username)
            .single()
            .execute()
        )

        if not res.data or not res.data.get("banned_until"):
            return False

        banned_until = datetime.fromisoformat(
            res.data["banned_until"].replace("Z", "")
        )
        return datetime.utcnow() < banned_until

    except Exception:
        return False

# ======================
# LLM
# ======================

def local_llm(prompt: str) -> str:
    r = requests.post(
        f"{LOCAL_LLM_URL}/v1/chat/completions",
        json={
            "model": "local-model",
            "messages": [
                {"role": "system", "content": "Sen BurakGPT'sin. Türkçe ve net cevap ver."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 512
        },
        timeout=60
    )
    return r.json()["choices"][0]["message"]["content"]

def ai_response(prompt: str) -> dict:
    # Görsel isteği
    if "çiz" in prompt or "görsel" in prompt:
        img = qwen_image.predict(prompt)
        return {"type": "image", "content": img}

    # OpenAI
    if not USE_LOCAL_LLM and openai_client:
        res = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Sen BurakGPT'sin."},
                {"role": "user", "content": prompt}
            ]
        )
        return {
            "type": "text",
            "content": res.choices[0].message.content
        }

    # Local LLM
    return {
        "type": "text",
        "content": local_llm(prompt)
    }

# ======================
# API
# ======================

@app.post("/api/chat")
def chat(req: ChatRequest):
    if is_user_banned(req.username):
        return {"type": "text", "content": "🚫 Banlısın"}

    # kullanıcıyı garantiye al
    supabase.table("users").upsert({
        "username": req.username
    }).execute()

    result = ai_response(req.message)

    supabase.table("messages").insert({
        "username": req.username,
        "message": req.message,
        "reply": result["content"],
        "type": result["type"]
    }).execute()

    return result

# ======================
# HEALTH
# ======================

@app.get("/")
def root():
    return {
        "status": "ok",
        "app": "BurakGPT",
        "engine": "local" if USE_LOCAL_LLM else "openai"
    }
