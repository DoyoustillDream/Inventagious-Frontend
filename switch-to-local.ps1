# Switch Frontend to Local Validator
# This script updates .env to use local validator

Write-Host "Switching Frontend to Local Validator..." -ForegroundColor Cyan
Write-Host ""

$envFile = ".env"

if (-not (Test-Path $envFile)) {
    Write-Host "ERROR: .env file not found!" -ForegroundColor Red
    exit 1
}

# Read current .env
$content = Get-Content $envFile -Raw

# Update Solana configuration
$content = $content -replace 'NEXT_PUBLIC_SOLANA_RPC_URL=https://api\.devnet\.solana\.com', 'NEXT_PUBLIC_SOLANA_RPC_URL=http://localhost:8899'

# Write back
Set-Content $envFile -Value $content -NoNewline

Write-Host "OK: Frontend configured for local validator" -ForegroundColor Green
Write-Host "   NEXT_PUBLIC_SOLANA_RPC_URL: http://localhost:8899" -ForegroundColor Gray
Write-Host ""
Write-Host "NOTE: Restart frontend for changes to take effect" -ForegroundColor Yellow
Write-Host ""

