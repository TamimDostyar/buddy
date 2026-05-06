#!/bin/bash
# author: Tamim
set -e

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'
NC='\033[0m'

MODEL_NAME="granite4:3b"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"


# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to print colored messages
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

detect_os() {
    print_info "Detecting operating system..."
    
    case "$(uname -s)" in
        Darwin*)
            OS="macos"
            print_success "Detected macOS"
            ;;
        Linux*)
            OS="linux"
            print_success "Detected Linux"
            ;;
        CYGWIN*|MINGW*|MSYS*)
            OS="windows"
            print_success "Detected Windows"
            ;;
        *)
            print_error "Unsupported operating system: $(uname -s)"
            exit 1
            ;;
    esac
}

check_ollama() {
    print_info "Checking for Ollama installation..."
    
    if command -v ollama &> /dev/null; then
        OLLAMA_VERSION=$(ollama --version 2>&1 | head -n 1)
        print_success "Ollama is already installed: $OLLAMA_VERSION"
        return 0
    else
        print_warning "Ollama is not installed"
        return 1
    fi
}

install_ollama() {
    print_info "Installing Ollama..."
    
    case $OS in
        macos|linux)
            print_info "Downloading and running Ollama installer..."
            curl -fsSL https://ollama.com/install.sh | sh
            
            if [ $? -eq 0 ]; then
                print_success "Ollama installed successfully"
            else
                print_error "Failed to install Ollama"
                exit 1
            fi
            ;;
        windows)
            print_warning "On Windows, please download Ollama manually from:"
            print_warning "https://ollama.com/download/windows"
            print_info "After installation, run this script again."
            exit 1
            ;;
    esac
}

check_ollama_service() {
    print_info "Checking if Ollama service is running..."

    if curl -s http://localhost:11434/api/tags &> /dev/null; then
        print_success "Ollama service is running"
        return 0
    else
        print_warning "Ollama service is not running"
        return 1
    fi
}

start_ollama_service() {
    print_info "Starting Ollama service..."
    
    case $OS in
        macos|linux)
            nohup ollama serve > /dev/null 2>&1 &
            sleep 3
            
            if check_ollama_service; then
                print_success "Ollama service started"
            else
                print_error "Failed to start Ollama service"
                exit 1
            fi
            ;;
        windows)
            print_info "Please start Ollama from the Start menu or system tray"
            sleep 5
            ;;
    esac
}

check_model() {
    print_info "Checking if model '$MODEL_NAME' is available..."
    
    if ollama list | grep -q "$MODEL_NAME"; then
        print_success "Model '$MODEL_NAME' is already available"
        return 0
    else
        print_warning "Model '$MODEL_NAME' is not available"
        return 1
    fi
}

pull_model() {
    print_info "Pulling model '$MODEL_NAME'..."
    print_warning "This may take a few minutes depending on your connection..."
    
    if ollama pull "$MODEL_NAME"; then
        print_success "Model '$MODEL_NAME' pulled successfully"
    else
        print_error "Failed to pull model '$MODEL_NAME'"
        exit 1
    fi
}

check_pnpm() {
    print_info "Checking for pnpm installation..."
    
    if command -v pnpm &> /dev/null; then
        PNPM_VERSION=$(pnpm --version)
        print_success "pnpm is already installed: v$PNPM_VERSION"
        return 0
    else
        print_warning "pnpm is not installed"
        return 1
    fi
}

install_pnpm() {
    print_info "Installing pnpm..."
    
    if command -v npm &> /dev/null; then
        npm install -g pnpm
        
        if [ $? -eq 0 ]; then
            print_success "pnpm installed successfully"
        else
            print_error "Failed to install pnpm"
            exit 1
        fi
    else
        print_error "npm is not installed. Please install Node.js first:"
        print_error "https://nodejs.org/"
        exit 1
    fi
}

install_dependencies() {
    print_info "Installing project dependencies..."
    
    if [ -f "$SCRIPT_DIR/package.json" ]; then
        cd "$SCRIPT_DIR"
        pnpm install
        
        if [ $? -eq 0 ]; then
            print_success "Dependencies installed successfully"
        else
            print_error "Failed to install dependencies"
            exit 1
        fi
    else
        print_error "package.json not found in $SCRIPT_DIR"
        exit 1
    fi
}

start_application() {
    print_info "Starting Ollama Buddy CLI..."
    echo ""
    echo "========================================"
    echo ""
    
    cd "$SCRIPT_DIR"
    pnpm start
}

main() {
    echo ""
    echo "========================================"
    echo "  Ollama Buddy CLI - Installation"
    echo "========================================"
    echo ""
    
    detect_os
    echo ""
    
    if ! check_ollama; then
        install_ollama
    fi
    echo ""
    
    if ! check_ollama_service; then
        start_ollama_service
    fi
    echo ""
    
    if ! check_model; then
        pull_model
    fi
    echo ""
    
    if ! check_pnpm; then
        install_pnpm
    fi
    echo ""
    
    install_dependencies
    echo ""
    
    start_application
}

main