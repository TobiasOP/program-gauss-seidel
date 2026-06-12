# Metode Gauss-Seidel — Aplikasi Web Komputasi Numerik

| NRP | Nama |
|---|---|
| 5025241025 | Tobias Orlando Purba |
| 5025241072 | Arya Rangga Putra Pratama |
| 5025241203 | Ahron Zakhruf Azura |
| 5025251236 | Gede Nararya Vatsa |

---

## Deskripsi Program

Program ini adalah aplikasi web interaktif yang mengimplementasikan metode iteratif **Gauss-Seidel** untuk menyelesaikan dua jenis permasalahan komputasi numerik: penyelesaian Sistem Persamaan Linear (SPL) secara langsung, dan pencarian koefisien polinomial orde 2 melalui regresi kuadrat terkecil. Seluruh komputasi berjalan sepenuhnya di sisi klien menggunakan JavaScript murni tanpa memerlukan server atau backend apapun.

Antarmuka dirancang responsif dengan dukungan dark mode dan light mode yang tersimpan secara persisten di `localStorage` browser. Input dibangkitkan secara dinamis sesuai ukuran matriks atau jumlah data yang dimasukkan pengguna, sehingga program dapat menangani berbagai skala permasalahan tanpa perlu mengubah kode.

---

## Mode Input

### Mode 01 — Input SPL Langsung

Pengguna memasukkan koefisien matriks A dan vektor konstanta B secara manual baris per baris. Ukuran matriks dapat dikonfigurasi dari 2×2 hingga 10×10 menggunakan input jumlah variabel N. Setiap baris input merepresentasikan satu persamaan linear dalam sistem, dengan kolom terakhir berwarna hijau sebagai penanda nilai konstanta (ruas kanan persamaan).

Setelah tombol "Buat Baris Input" ditekan, program membangkitkan form secara dinamis lengkap dengan label variabel `x₁, x₂, ..., xₙ` dan tanda `=` sebagai pemisah visual antara koefisien dan konstanta.

### Mode 02 — Tabel X & Y (Polinomial Orde 2)

Pengguna memasukkan pasangan data observasi (X, Y) dengan jumlah baris minimal 3. Program secara otomatis menghitung seluruh jumlah yang diperlukan (`Σx`, `Σx²`, `Σx³`, `Σx⁴`, `Σy`, `Σxy`, `Σx²y`) dari data yang dimasukkan, lalu membangun SPL 3×3 berdasarkan persamaan normal regresi. SPL tersebut kemudian diselesaikan dengan Gauss-Seidel untuk mendapatkan tiga koefisien polinomial `a₀`, `a₁`, dan `a₂`.

---

## Algoritma

### 1. Pengecekan Diagonal Dominan

Sebelum iterasi dimulai, program memeriksa apakah matriks A memenuhi syarat **diagonal dominan**, yaitu nilai absolut elemen diagonal harus lebih besar atau sama dengan jumlah nilai absolut seluruh elemen lain pada baris yang sama:

$$|a_{ii}| \geq \sum_{j \neq i} |a_{ij}| \quad \forall\, i$$

Syarat ini penting karena Gauss-Seidel hanya dijamin konvergen jika matriks bersifat diagonal dominan. Jika syarat tidak terpenuhi, program tetap melanjutkan proses namun menampilkan peringatan kepada pengguna bahwa hasil mungkin tidak konvergen atau lambat menuju solusi. Jika ditemukan elemen diagonal bernilai `0`, proses langsung dihentikan karena akan mengakibatkan pembagian dengan nol.

### 2. Inisialisasi

Seluruh variabel diinisialisasi dengan nilai awal `0`:

$$x_1^{(0)} = x_2^{(0)} = \cdots = x_n^{(0)} = 0$$

Pendekatan ini merupakan titik awal umum yang digunakan pada metode Gauss-Seidel. Kualitas tebakan awal dapat memengaruhi kecepatan konvergensi, namun pada matriks yang diagonal dominan, konvergensi tetap terjamin meskipun dimulai dari `0`.

### 3. Iterasi Gauss-Seidel

Pada setiap iterasi, program memperbarui nilai setiap variabel satu per satu secara berurutan. Kunci dari metode Gauss-Seidel adalah penggunaan nilai terbaru yang telah diperbarui dalam iterasi yang sama, bukan menunggu seluruh iterasi selesai seperti pada metode Gauss-Jacobi:

$$x_i^{(k+1)} = \frac{1}{a_{ii}} \left( b_i - \sum_{j < i} a_{ij}\, x_j^{(k+1)} - \sum_{j > i} a_{ij}\, x_j^{(k)} \right)$$

Artinya ketika menghitung `x₂`, program sudah menggunakan nilai `x₁` yang baru saja diperbarui pada langkah sebelumnya dalam iterasi yang sama. Hal ini membuat Gauss-Seidel umumnya lebih cepat konvergen dibandingkan Gauss-Jacobi.

### 4. Pengecekan Konvergensi

Setelah setiap variabel diperbarui, program menghitung error sebagai selisih absolut terbesar antara nilai baru dan nilai lama di seluruh variabel:

$$\varepsilon^{(k)} = \max_i \left| x_i^{(k+1)} - x_i^{(k)} \right|$$

Iterasi berhenti jika salah satu kondisi terpenuhi:
- Error sudah di bawah toleransi: `ε < 0.001`
- Jumlah iterasi sudah mencapai batas maksimal yang ditentukan pengguna

### 5. Regresi Polinomial Orde 2

Untuk Mode 02, data (X, Y) diubah terlebih dahulu menjadi SPL 3×3 menggunakan persamaan normal metode kuadrat terkecil. Persamaan normal diturunkan dari kondisi meminimalkan jumlah kuadrat residual antara data observasi dan polinomial pendekatan:

$$\begin{bmatrix} n & \sum x & \sum x^2 \\ \sum x & \sum x^2 & \sum x^3 \\ \sum x^2 & \sum x^3 & \sum x^4 \end{bmatrix} \begin{bmatrix} a_0 \\ a_1 \\ a_2 \end{bmatrix} = \begin{bmatrix} \sum y \\ \sum xy \\ \sum x^2 y \end{bmatrix}$$

SPL ini kemudian diselesaikan dengan Gauss-Seidel menggunakan prosedur yang sama seperti Mode 01, menghasilkan koefisien `a₀`, `a₁`, `a₂` sehingga terbentuk polinomial:

$$y = a_0 + a_1 x + a_2 x^2$$

---

## Struktur File

### `index.html`
File markup utama yang membangun seluruh antarmuka pengguna. Terdiri dari navigasi atas dengan logo dan tombol toggle tema, header deskripsi program, kartu utama yang memuat tab pemilihan mode beserta area input dinamis, dan area hasil komputasi yang awalnya tersembunyi. Seluruh komponen input (baris matriks dan tabel X/Y) tidak ditulis statis di HTML melainkan dibangkitkan oleh JavaScript saat dibutuhkan. Menggunakan Tailwind CSS via CDN untuk layout dan Lucide Icons untuk ikon antarmuka.

### `script.js`
Berisi seluruh logika program yang terbagi dalam beberapa bagian:

**Manajemen Tema** — Membaca preferensi tema dari `localStorage` saat halaman dimuat dan menerapkannya ke elemen `<html>`. Tombol toggle menukar class `dark` dan menyimpan preferensi baru.

**`generateMatrixUI()`** — Membaca nilai N dari input, lalu membangkitkan N baris form secara dinamis. Setiap baris terdiri dari N input koefisien berlabel `x₁` sampai `xₙ` dan satu input konstanta yang diberi warna berbeda sebagai penanda visual.

**`generatePolyUI()`** — Membangkitkan baris input pasangan X dan Y sesuai jumlah data yang dimasukkan, dengan validasi minimal 3 baris.

**`solveGaussSeidel(matrix, constants, tolerance, maxIter)`** — Fungsi inti komputasi. Menerima matriks A, vektor B, toleransi error, dan batas iterasi. Melakukan pengecekan diagonal dominan, menjalankan iterasi Gauss-Seidel, menyimpan snapshot nilai seluruh variabel di setiap iterasi, dan mengembalikan objek hasil berisi status konvergensi, tabel iterasi lengkap, dan solusi akhir.

**Event listener tombol hitung** — Mengambil seluruh nilai dari form input, membangun matriks dan vektor konstanta, memanggil `solveGaussSeidel`, lalu merender hasilnya ke DOM dalam bentuk tabel iterasi dan kartu solusi akhir. Pada Mode 02, perhitungan jumlah (`Σx`, `Σx²`, dll.) dilakukan di sini sebelum matriks dikirim ke solver.

### `style.css`
Mendefinisikan sistem warna menggunakan CSS custom properties berbasis format warna `oklch` untuk kedua tema. Setiap variabel seperti `--background`, `--foreground`, `--card`, `--border`, dan `--muted-foreground` didefinisikan ulang di bawah selector `html.dark` untuk mengaktifkan dark mode. Tailwind CSS kemudian membaca variabel-variabel ini melalui konfigurasi yang dideklarasikan di `tailwind.config`. File ini juga menghilangkan spinner bawaan browser pada `input[type="number"]` agar tampilan lebih bersih di semua browser.

---

## Batasan

- Elemen diagonal bernilai `0` menyebabkan proses dihentikan karena mengakibatkan pembagian dengan nol
- Matriks yang tidak memenuhi syarat diagonal dominan tetap diproses namun konvergensi tidak dapat dijamin; hasil bisa saja divergen
- Toleransi error ditetapkan secara permanen di `ε = 0.001` dan tidak dapat diubah oleh pengguna melalui antarmuka
- Output ditampilkan dengan presisi 2 angka desimal
- Ukuran matriks dibatasi maksimal 10×10 untuk menjaga performa rendering antarmuka
