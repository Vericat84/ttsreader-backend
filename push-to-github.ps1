# Script para subir el backend a GitHub
# Ejecuta este script DESPUÉS de crear el repositorio en GitHub

Write-Host "🚀 Preparando push a GitHub..." -ForegroundColor Cyan

# Preguntar por el usuario de GitHub
$githubUser = Read-Host "Ingresa tu nombre de usuario de GitHub"
$repoName = Read-Host "Ingresa el nombre del repositorio (o presiona Enter para 'ttsreader-backend')"

if ([string]::IsNullOrWhiteSpace($repoName)) {
    $repoName = "ttsreader-backend"
}

$repoUrl = "https://github.com/$githubUser/$repoName.git"

Write-Host "`n📤 Conectando con: $repoUrl" -ForegroundColor Yellow

# Añadir remote
git remote add origin $repoUrl 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  El remote ya existe, actualizando..." -ForegroundColor Yellow
    git remote set-url origin $repoUrl
}

# Push
Write-Host "`n📤 Subiendo código..." -ForegroundColor Cyan
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ ¡Código subido exitosamente!" -ForegroundColor Green
    Write-Host "🔗 Repositorio: https://github.com/$githubUser/$repoName" -ForegroundColor Cyan
    Write-Host "`n🎯 Próximo paso: Continuar con Railway" -ForegroundColor Yellow
} else {
    Write-Host "`n❌ Error al subir. Verifica:" -ForegroundColor Red
    Write-Host "   1. Que el repositorio exista en GitHub" -ForegroundColor Yellow
    Write-Host "   2. Que tengas permisos para escribir" -ForegroundColor Yellow
    Write-Host "   3. Que estés autenticado en Git" -ForegroundColor Yellow
}

