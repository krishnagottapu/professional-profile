#!/bin/bash
echo "Starting Portfolio Frontend..."
echo "Frontend will be available at http://localhost:3000"
echo ""
cd "$(dirname "$0")/frontend"
if [ ! -d "node_modules" ]; then
    echo "node_modules not found, running npm install..."
    npm install
fi
npm run dev
