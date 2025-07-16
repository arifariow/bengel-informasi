@echo off
echo ========================================
echo Tips & Trik Kendaraan - Website Launcher
echo ========================================
echo.
echo Memulai server lokal...
echo.

REM Cek apakah Python tersedia
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python tidak ditemukan!
    echo Silakan install Python terlebih dahulu.
    echo Download dari: https://python.org
    pause
    exit /b 1
)

echo Python ditemukan, memulai server...
echo.
echo Server akan berjalan di: http://localhost:8000
echo.
echo INSTRUKSI:
echo 1. Biarkan jendela ini tetap terbuka
echo 2. Buka browser dan kunjungi: http://localhost:8000
echo 3. Tekan Ctrl+C di jendela ini untuk menghentikan server
echo.
echo ========================================
echo.

REM Jalankan server Python
python server.py

pause
