import os
if not res.data:
return False
banned_until = res.data.get("banned_until")
return banned_until and datetime.utcnow() < datetime.fromisoformat(banned_until.replace("Z", ""))
except Exception:
return False




def local_llm(prompt: str) -> str:
r = requests.post(
f"{LOCAL_LLM_URL}/v1/chat/completions",
json={
"model": "local-model",
"messages": [
{"role": "system", "content": "Sen BurakGPT'sin. Türkçe, net cevap ver."},
{"role": "user", "content": prompt}
],
"temperature": 0.7,
"max_tokens": 512
},
timeout=60
)
return r.json()["choices"][0]["message"]["content"]




def ai_response(prompt: str) -> dict:
if "çiz" in prompt or "görsel" in prompt:
img = qwen_image.predict(prompt)
return {"type": "image", "content": img}


if not USE_LOCAL_LLM and openai_client:
res = openai_client.chat.completions.create(
model="gpt-4o-mini",
messages=[
{"role": "system", "content": "Sen BurakGPT'sin."},
{"role": "user", "content": prompt}
]
)
return {"type": "text", "content": res.choices[0].message.content}


return {"type": "text", "content": local_llm(prompt)}




@app.post("/api/chat")
def chat(req: ChatRequest):
if is_user_banned(req.username):
return {"type": "text", "content": "🚫 Banlısın"}


supabase.table("users").upsert({"username": req.username}).execute()
result = ai_response(req.message)


supabase.table("messages").insert({
"username": req.username,
"message": req.message,
"reply": str(result)
}).execute()


return result
