const express = require('express');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const port = 3000;

// Middleware agar Express bisa membaca data JSON yang dikirim script.js
app.use(express.json());

// Memberitahu server untuk menyajikan file index.html, style.css, script.js
app.use(express.static(__dirname));

// Endpoint utama tempat script.js mengirim data
app.post('/calculate', (req, res) => {
    // Menangkap data dari front-end
    const { matrix, constants, tolerance, maxIter } = req.body;

    // 1. Mengubah struktur data menjadi teks agar bisa dibaca oleh C++ lewat terminal (stdin)
    // Format: UkuranMatriks Toleransi MaxIter [IsiMatriks] [IsiKonstanta]
    const n = matrix.length;
    let inputString = `${n} ${tolerance} ${maxIter}\n`;

    matrix.forEach(row => {
        inputString += row.join(' ') + '\n';
    });
    inputString += constants.join(' ') + '\n';

    // 2. Memanggil program C++ yang sudah dikompilasi
    // Ganti './gauss_seidel' menjadi 'gauss_seidel.exe' jika kamu menggunakan Windows
    const cppProcess = spawn('./gauss_seidel');

    let outputData = '';
    let errorData = '';

    // Mengirim teks matriks ke program C++ seolah-olah kita mengetiknya di terminal
    cppProcess.stdin.write(inputString);
    cppProcess.stdin.end();

    // Menangkap hasil perhitungan (printf/cout) dari C++
    cppProcess.stdout.on('data', (data) => {
        outputData += data.toString();
    });

    // Menangkap pesan eror jika program C++ *crash* atau gagal jalan
    cppProcess.stderr.on('data', (data) => {
        errorData += data.toString();
    });

    // Mengirimkan hasilnya kembali ke website (HTML) setelah C++ selesai berhitung
    cppProcess.on('close', (code) => {
        if (code !== 0 || errorData) {
            console.error(`Proses C++ gagal: ${errorData}`);
            return res.status(500).json({ error: 'Terjadi kesalahan pada komputasi C++.', details: errorData });
        }
        
        // Kirim hasil sukses ke front-end
        res.json({ result: outputData });
    });
});

app.listen(port, () => {
    console.log(`Server berhasil berjalan! Buka http://localhost:${port} di browser kamu.`);
});