#!/usr/bin/env bash

echo "Starting BurakGPT..."

cd frontend
npm install
npm run build &

cd ../backend
uvicorn main:app --host 0.0.0.0 --port $PORT
