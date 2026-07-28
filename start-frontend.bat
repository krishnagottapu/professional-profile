@echo off
echo Starting Portfolio Frontend...
echo Frontend will be available at http://localhost:3000
echo.
cd /d "%~dp0frontend"
if not exist node_modules (
    echo node_modules not found, running npm install...
    npm install
)
npm run dev
