@echo off
REM Empacota a interface Tkinter em meu-pdf.exe (raiz do projeto, ao lado de build.mjs).
REM O .exe e so o lancador: precisa ficar DENTRO da pasta meu-pdf (presets/, themes/,
REM node_modules/, build.mjs). Nao distribua o exe sozinho.
REM
REM Se o antivirus do Windows acusar falso positivo (comum com PyInstaller --onefile),
REM troque --onefile por --onedir na linha do pyinstaller abaixo.

cd /d "%~dp0"

python -m pip install pyinstaller
if errorlevel 1 exit /b 1

pyinstaller --noconfirm --onefile --windowed --name meu-pdf --distpath . --workpath "%TEMP%\meu-pdf-build" --specpath ui ui\app.py
if errorlevel 1 exit /b 1

echo.
echo OK: meu-pdf.exe gerado em %cd%
echo Abra com duplo clique no Explorer (nao pelo terminal).
exit /b 0
