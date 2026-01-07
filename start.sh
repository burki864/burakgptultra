#!/bin/bash
# =========================
# BurakGPT Render start.sh
# =========================

# Fail on first error
set -e

echo "🟢 Starting BurakGPT..."

# 1️⃣ Backend başlat
echo "🚀 Starting backend..."
cd backend
# FastAPI için uvicorn
# PORT Render tarafından atanacaksa $PORT kullan
uvicorn main:app --host 0.0.0.0 --port ${PORT:-10000} &
BACKEND_PID=$!
cd ..

# 2️⃣ Frontend başlat
echo "🌐 Starting frontend..."
cd frontend
# Next.js için
npm install
npm run build
npm run start &
FRONTEND_PID=$!
cd ..

# 3️⃣ Bekle ve logları göster
wait $BACKEND_PID $FRONTEND_PID
