document.addEventListener('DOMContentLoaded', () => {
    // 1. Mengambil referensi elemen dari HTML
    const generateBtn = document.getElementById('generate-matrix-btn');
    const calculateBtn = document.getElementById('calculate-btn');
    const matrixSection = document.getElementById('matrix-section');
    const matrixContainer = document.getElementById('matrix-inputs-container');
    const resultSection = document.getElementById('result-section');
    const resultOutput = document.getElementById('result-output');

    let currentMatrixSize = 3;

    // 2. Fungsi untuk membuat kotak input matriks
    generateBtn.addEventListener('click', () => {
        currentMatrixSize = parseInt(document.getElementById('matrix-size').value);
        
        // Validasi input
        if (currentMatrixSize < 2 || currentMatrixSize > 10) {
            alert("Masukkan ukuran matriks antara 2 hingga 10.");
            return;
        }

        // Kosongkan kontainer matriks jika sudah ada isinya
        matrixContainer.innerHTML = '';

        // Mengatur grid CSS agar rapi (Kolom = variabel X + 1 kolom untuk hasil/konstanta)
        matrixContainer.style.display = 'grid';
        matrixContainer.style.gridTemplateColumns = `repeat(${currentMatrixSize + 1}, 1fr)`;
        matrixContainer.style.gap = '10px';
        matrixContainer.style.marginTop = '15px';

        // Membuat baris dan kolom
        for (let i = 0; i < currentMatrixSize; i++) {
            for (let j = 0; j <= currentMatrixSize; j++) {
                const wrapper = document.createElement('div');
                wrapper.style.display = 'flex';
                wrapper.style.alignItems = 'center';
                wrapper.style.gap = '5px';

                const input = document.createElement('input');
                input.type = 'number';
                input.step = 'any'; // Mengizinkan angka desimal
                input.className = 'matrix-cell';
                input.id = `cell-${i}-${j}`;
                input.required = true;
                input.style.width = '60px';

                // Menambahkan label (X1, X2... atau '=' untuk kolom terakhir)
                const label = document.createElement('span');
                if (j < currentMatrixSize) {
                    label.textContent = `X${j + 1}`;
                    if (j < currentMatrixSize - 1) label.textContent += ' +';
                } else {
                    label.textContent = '=';
                    wrapper.insertBefore(label, input); // Pindahkan '=' ke depan input hasil
                }

                if (j < currentMatrixSize) {
                    wrapper.appendChild(input);
                    wrapper.appendChild(label);
                } else {
                    wrapper.appendChild(input);
                }

                matrixContainer.appendChild(wrapper);
            }
        }

        // Menampilkan area matriks
        matrixSection.style.display = 'block';
        resultSection.style.display = 'none'; // Sembunyikan hasil lama jika ada
    });

    // 3. Fungsi untuk mengumpulkan data dan "Mengirim" ke C++
    calculateBtn.addEventListener('click', () => {
        const matrixData = [];
        const constantsData = [];
        
        // Membaca toleransi dan maksimal iterasi
        const tolerance = parseFloat(document.getElementById('tolerance').value);
        const maxIter = parseInt(document.getElementById('max-iter').value);

        try {
            // Mengambil semua nilai dari kotak input
            for (let i = 0; i < currentMatrixSize; i++) {
                const row = [];
                for (let j = 0; j <= currentMatrixSize; j++) {
                    const cellValue = document.getElementById(`cell-${i}-${j}`).value;
                    
                    if (cellValue === '') {
                        throw new Error("Semua kotak matriks harus diisi!");
                    }

                    if (j < currentMatrixSize) {
                        row.push(parseFloat(cellValue));
                    } else {
                        constantsData.push(parseFloat(cellValue));
                    }
                }
                matrixData.push(row);
            }

            // --- JEMBATAN KE C++ DIMULAI DI SINI ---
            
            console.log("Data Matriks:", matrixData);
            console.log("Data Konstanta:", constantsData);
            console.log("Toleransi:", tolerance, "Max Iter:", maxIter);

            resultSection.style.display = 'block';
            resultOutput.innerHTML = `<p style="color: blue;"><i>Sedang memproses data... (Di sinilah fungsi C++ akan dipanggil nantinya)</i></p>`;

            // --- KODE INTEGRASI KE SERVER NODE.JS ---
            
            fetch('http://localhost:3000/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    matrix: matrixData,
                    constants: constantsData,
                    tolerance: tolerance,
                    maxIter: maxIter
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    resultOutput.innerHTML = `<p style="color: red;"><strong>Gagal:</strong> ${data.error}</p>`;
                } else {
                    // Mengubah karakter \n dari C++ menjadi tag <br> di HTML agar enter-nya berfungsi
                    const formattedResult = data.result.replace(/\n/g, '<br>');
                    resultOutput.innerHTML = `<div>${formattedResult}</div>`;
                }
            })
            .catch(err => {
                resultOutput.innerHTML = `<p style="color: red;"><strong>Error:</strong> Tidak dapat menghubungi server. Pastikan server.js sudah dijalankan.</p>`;
            });

        } catch (error) {
            alert(error.message);
        }
    });
});