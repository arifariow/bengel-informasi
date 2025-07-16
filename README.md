# Website Tips & Trik Kendaraan

Website informatif yang menyediakan tips dan trik perawatan kendaraan (mobil, motor, truk) dengan data yang disimpan dalam format JSON.

## Fitur Utama

- **Responsive Design**: Menggunakan Bootstrap 5 untuk tampilan yang optimal di semua perangkat
- **Kategori Kendaraan**: Tips terorganisir berdasarkan jenis kendaraan (Mobil, Motor, Truk, Perawatan)
- **Pencarian**: Fitur pencarian untuk menemukan tips spesifik
- **Data JSON**: Semua konten disimpan dalam file `data/data.json` yang mudah dikelola
- **Empty State**: Menampilkan pesan kosong ketika data tidak tersedia
- **Loading State**: Animasi loading saat memuat data

## Struktur File

```
├── index.html              # Halaman utama
├── assets/
│   ├── css/
│   │   └── style.css      # Custom CSS styling
│   └── js/
│       └── main.js        # JavaScript functionality
├── data/
│   └── data.json          # Data tips dan trik
└── README.md              # Dokumentasi
```

## Cara Menggunakan

1. **Buka Website**: Buka file `index.html` di browser
2. **Navigasi Kategori**: Klik menu kategori untuk filter tips berdasarkan jenis kendaraan
3. **Pencarian**: Gunakan kotak pencarian untuk mencari tips spesifik
4. **Baca Tips**: Klik atau scroll untuk membaca tips lengkap dengan langkah-langkah

## Mengelola Data

### Format Data JSON

Data tips disimpan dalam file `data/data.json` dengan struktur:

```json
{
  "tips": [
    {
      "id": 1,
      "title": "Judul Tips",
      "description": "Deskripsi singkat tips",
      "category": "Mobil|Motor|Truk|Perawatan",
      "difficulty": "Mudah|Sedang|Sulit",
      "readTime": "X menit baca",
      "steps": [
        "Langkah 1",
        "Langkah 2"
      ],
      "tips": [
        "Tips tambahan 1",
        "Tips tambahan 2"
      ]
    }
  ]
}
```

### Menambah Tips Baru

1. Buka file `data/data.json`
2. Tambahkan objek tips baru dalam array `tips`
3. Pastikan menggunakan format yang sama
4. Refresh halaman website untuk melihat perubahan

### Kategori yang Tersedia

- **Mobil**: Tips khusus untuk mobil
- **Motor**: Tips khusus untuk sepeda motor
- **Truk**: Tips khusus untuk truk
- **Perawatan**: Tips perawatan umum untuk semua kendaraan

## Teknologi yang Digunakan

- **HTML5**: Struktur halaman
- **CSS3**: Styling dan animasi
- **JavaScript ES6+**: Fungsionalitas interaktif
- **Bootstrap 5**: Framework CSS responsive
- **Font Awesome**: Icon library

## Fitur Khusus

### Empty State
Jika file `data.json` kosong atau tidak ada data, website akan menampilkan:
- Icon inbox
- Pesan "Belum Ada Tips Tersedia"
- Informasi bahwa tips akan ditampilkan ketika data tersedia

### No Results State
Ketika pencarian tidak menemukan hasil:
- Icon search
- Pesan "Tidak Ada Hasil Ditemukan"
- Saran untuk menggunakan kata kunci berbeda

### Loading State
Saat memuat data:
- Spinner loading
- Pesan "Memuat tips dan trik..."

## Kustomisasi

### Mengubah Warna Tema
Edit variabel CSS di `assets/css/style.css`:

```css
:root {
    --primary-color: #0d6efd;
    --secondary-color: #6c757d;
    /* ... */
}
```

### Menambah Kategori Baru
1. Tambahkan link kategori di navigation (`index.html`)
2. Tambahkan styling kategori di `assets/css/style.css`
3. Update fungsi `getCategoryIcon()` di `assets/js/main.js`

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Instalasi

1. Download atau clone repository
2. Buka `index.html` di browser
3. Tidak memerlukan server khusus (dapat dijalankan secara lokal)

## Kontribusi

Untuk menambah atau mengubah tips:
1. Edit file `data/data.json`
2. Pastikan format JSON valid
3. Test di browser untuk memastikan tampilan benar

## Lisensi

Website ini dibuat untuk tujuan edukasi dan dapat digunakan secara bebas.
