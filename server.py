#!/usr/bin/env python3
"""
Simple HTTP Server untuk Website Tips & Trik Kendaraan
Mengatasi masalah CORS saat mengakses file JSON lokal
"""

import http.server
import socketserver
import webbrowser
import os
import sys

# Konfigurasi server
PORT = 8000
HOST = 'localhost'

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Menambahkan header CORS untuk mengizinkan akses file JSON
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def log_message(self, format, *args):
        # Custom log format
        print(f"[{self.address_string()}] {format % args}")

def start_server():
    """Memulai server HTTP lokal"""
    try:
        # Pastikan kita berada di direktori yang benar
        script_dir = os.path.dirname(os.path.abspath(__file__))
        os.chdir(script_dir)
        
        # Buat server
        with socketserver.TCPServer((HOST, PORT), CustomHTTPRequestHandler) as httpd:
            server_url = f"http://{HOST}:{PORT}"
            
            print("=" * 60)
            print("🚗 Tips & Trik Kendaraan - Local Server")
            print("=" * 60)
            print(f"Server berjalan di: {server_url}")
            print(f"Direktori: {os.getcwd()}")
            print("\n📋 Cara menggunakan:")
            print(f"1. Buka browser dan kunjungi: {server_url}")
            print("2. Atau tekan Ctrl+C untuk menghentikan server")
            print("\n🔧 File yang tersedia:")
            print("- index.html (Halaman utama)")
            print("- data/data.json (Data tips)")
            print("- assets/ (CSS & JavaScript)")
            print("=" * 60)
            
            # Buka browser otomatis
            try:
                webbrowser.open(server_url)
                print(f"✅ Browser dibuka otomatis ke {server_url}")
            except:
                print("⚠️  Tidak dapat membuka browser otomatis")
                print(f"   Silakan buka manual: {server_url}")
            
            print("\n🟢 Server aktif... (Tekan Ctrl+C untuk berhenti)")
            
            # Jalankan server
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n\n🛑 Server dihentikan oleh user")
        sys.exit(0)
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ Port {PORT} sudah digunakan!")
            print("   Coba gunakan port lain atau hentikan aplikasi yang menggunakan port tersebut")
        else:
            print(f"❌ Error: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Terjadi kesalahan: {e}")
        sys.exit(1)

if __name__ == "__main__":
    start_server()
