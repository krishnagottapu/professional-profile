#!/bin/bash

echo "======================================"
echo " Portfolio - Mac Setup Script"
echo "======================================"
echo ""

# ── Homebrew ──────────────────────────────
if ! command -v brew &>/dev/null; then
    echo "[1/4] Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

    # Add Homebrew to PATH for Apple Silicon Macs
    if [[ "$(uname -m)" == "arm64" ]]; then
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> "$HOME/.zprofile"
        eval "$(/opt/homebrew/bin/brew shellenv)"
    fi
    echo "[1/4] Homebrew installed."
else
    echo "[1/4] Homebrew already installed — skipping."
fi

# ── Java 21 ───────────────────────────────
if ! java -version 2>&1 | grep -q "version \"21"; then
    echo "[2/4] Installing Java 21 (Temurin)..."
    brew install --cask temurin@21
    echo "[2/4] Java 21 installed."
else
    echo "[2/4] Java 21 already installed — skipping."
fi

# ── Maven ─────────────────────────────────
if ! command -v mvn &>/dev/null; then
    echo "[3/4] Installing Maven..."
    brew install maven
    echo "[3/4] Maven installed."
else
    echo "[3/4] Maven $(mvn -q -v 2>&1 | head -1) already installed — skipping."
fi

# ── Node.js ───────────────────────────────
if ! command -v node &>/dev/null; then
    echo "[4/4] Installing Node.js (LTS)..."
    brew install node@20
    brew link node@20 --force
    echo "[4/4] Node.js installed."
else
    NODE_VER=$(node -v)
    echo "[4/4] Node.js $NODE_VER already installed — skipping."
fi

# ── Summary ───────────────────────────────
echo ""
echo "======================================"
echo " All prerequisites ready!"
echo "======================================"
echo ""
echo "  Java:  $(java -version 2>&1 | head -1)"
echo "  Maven: $(mvn -v 2>&1 | head -1)"
echo "  Node:  $(node -v)"
echo "  npm:   $(npm -v)"
echo ""
echo "Next steps:"
echo "  chmod +x start-backend.sh start-frontend.sh"
echo "  Open two terminals and run:"
echo "    ./start-backend.sh"
echo "    ./start-frontend.sh"
echo ""
