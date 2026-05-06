param(
    [string]$ModelName = "granite4:3b"
)

$ErrorActionPreference = "Stop"

function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[✓] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

function Test-WindowsVersion {
    Write-Info "Detecting Windows version..."
    $osInfo = Get-CimInstance Win32_OperatingSystem
    Write-Success "Detected: $($osInfo.Caption) - Version $($osInfo.Version)"
}

function Test-OllamaInstalled {
    Write-Info "Checking for Ollama installation..."
    
    try {
        $version = & ollama --version 2>&1
        Write-Success "Ollama is already installed: $version"
        return $true
    }
    catch {
        Write-Warning "Ollama is not installed"
        return $false
    }
}

function Install-Ollama {
    Write-Info "Installing Ollama..."
    Write-Warning "Please download and install Ollama manually from:"
    Write-Warning "https://ollama.com/download/windows"
    Write-Info ""
    
    $response = Read-Host "Have you installed Ollama? (y/n)"
    if ($response -ne "y") {
        Write-Error "Please install Ollama and run this script again"
        exit 1
    }
    
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
}

function Test-OllamaService {
    Write-Info "Checking if Ollama service is running..."
    
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -UseBasicParsing -TimeoutSec 2
        Write-Success "Ollama service is running"
        return $true
    }
    catch {
        Write-Warning "Ollama service is not running"
        return $false
    }
}

function Start-OllamaService {
    Write-Info "Starting Ollama service..."
    Write-Info "Please start Ollama from the Start menu or system tray"
    
    Start-Sleep -Seconds 5
    
    if (Test-OllamaService) {
        Write-Success "Ollama service is now running"
    }
    else {
        Write-Error "Failed to detect Ollama service. Please start it manually."
        exit 1
    }
}

function Test-ModelAvailable {
    param([string]$Model)
    
    Write-Info "Checking if model '$Model' is available..."
    
    try {
        $modelList = & ollama list 2>&1
        if ($modelList -match $Model) {
            Write-Success "Model '$Model' is already available"
            return $true
        }
        else {
            Write-Warning "Model '$Model' is not available"
            return $false
        }
    }
    catch {
        Write-Warning "Could not check model list"
        return $false
    }
}

function Install-Model {
    param([string]$Model)
    
    Write-Info "Pulling model '$Model'..."
    Write-Warning "This may take a few minutes depending on your connection..."
    
    try {
        & ollama pull $Model
        Write-Success "Model '$Model' pulled successfully"
    }
    catch {
        Write-Error "Failed to pull model '$Model'"
        exit 1
    }
}

function Test-PnpmInstalled {
    Write-Info "Checking for pnpm installation..."
    
    try {
        $version = & pnpm --version 2>&1
        Write-Success "pnpm is already installed: v$version"
        return $true
    }
    catch {
        Write-Warning "pnpm is not installed"
        return $false
    }
}

function Install-Pnpm {
    Write-Info "Installing pnpm..."
    
    try {
        $null = & npm --version 2>&1
        & npm install -g pnpm
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "pnpm installed successfully"
        }
        else {
            throw "pnpm installation failed"
        }
    }
    catch {
        Write-Error "npm is not installed. Please install Node.js first:"
        Write-Error "https://nodejs.org/"
        exit 1
    }
}

function Install-Dependencies {
    Write-Info "Installing project dependencies..."
    
    $scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
    $packageJson = Join-Path $scriptDir "package.json"
    
    if (Test-Path $packageJson) {
        Set-Location $scriptDir
        & pnpm install
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Dependencies installed successfully"
        }
        else {
            Write-Error "Failed to install dependencies"
            exit 1
        }
    }
    else {
        Write-Error "package.json not found in $scriptDir"
        exit 1
    }
}

function Start-Application {
    Write-Info "Starting Ollama Buddy CLI..."
    Write-Host ""
    Write-Host "========================================"
    Write-Host ""
    
    $scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
    Set-Location $scriptDir
    & pnpm start
}

function Main {
    Write-Host ""
    Write-Host "========================================"
    Write-Host "  Ollama Buddy CLI - Installation"
    Write-Host "========================================"
    Write-Host ""
    
    Test-WindowsVersion
    Write-Host ""
    
    if (-not (Test-OllamaInstalled)) {
        Install-Ollama
    }
    Write-Host ""
    
    if (-not (Test-OllamaService)) {
        Start-OllamaService
    }
    Write-Host ""
    
    if (-not (Test-ModelAvailable -Model $ModelName)) {
        Install-Model -Model $ModelName
    }
    Write-Host ""
    
    if (-not (Test-PnpmInstalled)) {
        Install-Pnpm
    }
    Write-Host ""
    
    Install-Dependencies
    Write-Host ""
    
    Start-Application
}

Main