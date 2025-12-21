@echo off
echo ========================================
echo   VIZZIO V3.0 - LANCAMENTO OFICIAL
echo   Desenvolvido por Nicolas Avila
echo ========================================
echo.

echo [1/5] Verificando status do Git...
git status --short
echo.

echo [2/5] Fazendo commit de todos os arquivos...
git add .
git commit -m "Release v3.0.0 - Complete 3D/VR System"
echo.

echo [3/5] Fazendo push para GitHub...
git push origin main
echo.

echo [4/5] Criando tag v3.0.0...
git tag -a v3.0.0 -m "Vizzio v3.0.0 - Complete 3D/VR System"
echo.

echo [5/5] Fazendo push da tag...
git push origin v3.0.0
echo.

echo ========================================
echo   PROXIMOS PASSOS:
echo ========================================
echo.
echo 1. Va para: https://github.com/avilaops/vizzio2/releases/new
echo 2. Selecione a tag: v3.0.0
echo 3. Titulo: Vizzio v3.0.0 - Complete 3D/VR System
echo 4. Copie o conteudo de: RELEASE_NOTES.md
echo 5. Marque: Set as the latest release
echo 6. Clique: Publish release
echo.
echo 7. Configure GitHub Pages:
echo    - Va para: https://github.com/avilaops/vizzio2/settings/pages
echo    - Source: Deploy from a branch
echo    - Branch: main
echo    - Folder: /docs/landing
echo    - Custom domain: vr.avila.inc
echo    - Save
echo.
echo 8. Configure DNS (no provedor de vr.avila.inc):
echo    Type: CNAME
echo    Name: vr
echo    Value: avilaops.github.io
echo    TTL: 3600
echo.
echo 9. Aguarde 1-2 horas para propagacao DNS
echo.
echo 10. Verifique: https://vr.avila.inc
echo.
echo ========================================
echo   LANCAMENTO CONCLUIDO!
echo ========================================
echo.
echo Sucesso! Vizzio v3.0 esta pronto para o mundo!
echo.
pause
