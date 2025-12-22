# Script para substituir todas as ocorrências de "ArxisVR" por "ArxisVR"
# em todos os arquivos do projeto

$projectRoot = "C:\Users\Administrador\source\repos\ArxisVR"
$oldName = "ArxisVR"
$newName = "ArxisVR"

# Pastas a excluir da busca
$excludeFolders = @('bin', 'obj', '.vs', 'node_modules', 'packages')

Write-Host "Iniciando substituição de '$oldName' para '$newName'..." -ForegroundColor Green
Write-Host "Pasta raiz: $projectRoot" -ForegroundColor Cyan
Write-Host ""

# Função para verificar se o caminho está em uma pasta excluída
function Should-ExcludePath {
    param($path)
    foreach ($folder in $excludeFolders) {
        if ($path -like "*\$folder\*") {
            return $true
        }
    }
    return $false
}

# Obter todos os arquivos recursivamente
$files = Get-ChildItem -Path $projectRoot -File -Recurse -ErrorAction SilentlyContinue | 
    Where-Object { -not (Should-ExcludePath $_.FullName) }

$totalFiles = $files.Count
$processedFiles = 0
$modifiedFiles = 0

Write-Host "Encontrados $totalFiles arquivos para processar..." -ForegroundColor Yellow
Write-Host ""

foreach ($file in $files) {
    $processedFiles++
    
    try {
        # Ler o conteúdo do arquivo
        $content = Get-Content -Path $file.FullName -Raw -ErrorAction Stop
        
        # Verificar se contém "ArxisVR" (case-insensitive)
        if ($content -match $oldName) {
            # Substituir todas as variações
            $newContent = $content -replace $oldName, $newName
            $newContent = $newContent -replace $oldName.ToLower(), $newName
            $newContent = $newContent -replace $oldName.ToUpper(), $newName.ToUpper()
            
            # Salvar o arquivo
            Set-Content -Path $file.FullName -Value $newContent -NoNewline -ErrorAction Stop
            
            $modifiedFiles++
            Write-Host "[$processedFiles/$totalFiles] ✓ $($file.FullName)" -ForegroundColor Green
        }
        else {
            Write-Host "[$processedFiles/$totalFiles] - $($file.FullName)" -ForegroundColor Gray
        }
    }
    catch {
        Write-Host "[$processedFiles/$totalFiles] ✗ Erro ao processar: $($file.FullName)" -ForegroundColor Red
        Write-Host "  Erro: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Concluído!" -ForegroundColor Green
Write-Host "Arquivos processados: $processedFiles" -ForegroundColor White
Write-Host "Arquivos modificados: $modifiedFiles" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
