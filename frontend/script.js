document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-matrix-btn');
    const calculateBtn = document.getElementById('calculate-btn');
    const matrixContainer = document.getElementById('matrix-inputs-container');
    const resultSection = document.getElementById('result-section');
    const resultOutput = document.getElementById('result-output');

    const SUBSCRIPTS = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];
    let currentMatrixSize = 3;

    function generateMatrixUI() {
        currentMatrixSize = parseInt(document.getElementById('matrix-size').value);
        
        if (currentMatrixSize < 2 || currentMatrixSize > 10) {
            alert("Masukkan ukuran matriks antara 2 hingga 10.");
            return;
        }

        matrixContainer.innerHTML = '';
        matrixContainer.className = "inline-flex flex-col gap-3";

        // Judul x1, x2, dst di atas tabel
        const headerRow = document.createElement('div');
        headerRow.className = "flex items-center gap-3 pr-20";

        for (let i = 0; i < currentMatrixSize; i++) {
            const th = document.createElement('div');
            th.className = "w-16 text-center font-mono text-sm font-semibold text-muted-foreground";
            th.textContent = `x${SUBSCRIPTS[i + 1]}`;
            headerRow.appendChild(th);
        }
        matrixContainer.appendChild(headerRow);

        // Baris kotak input
        for (let i = 0; i < currentMatrixSize; i++) {
            const rowWrapper = document.createElement('div');
            rowWrapper.className = "flex items-center gap-3";

            for (let j = 0; j < currentMatrixSize; j++) {
                const input = document.createElement('input');
                input.type = 'number';
                input.step = 'any';
                input.id = `cell-${i}-${j}`;
                input.placeholder = "0";
                input.className = "w-16 rounded-lg border border-border bg-background px-3 py-2 text-center font-mono text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";
                rowWrapper.appendChild(input);
            }

            const equalsWrapper = document.createElement('div');
            equalsWrapper.className = "flex w-6 justify-center";
            const equalsSpan = document.createElement('span');
            equalsSpan.className = "font-mono text-sm font-bold text-muted-foreground";
            equalsSpan.textContent = "=";
            equalsWrapper.appendChild(equalsSpan);
            rowWrapper.appendChild(equalsWrapper);

            const constInput = document.createElement('input');
            constInput.type = 'number';
            constInput.step = 'any';
            constInput.id = `cell-${i}-${currentMatrixSize}`;
            constInput.placeholder = "0";
            constInput.className = "w-16 rounded-lg border border-primary/50 bg-primary/5 px-3 py-2 text-center font-mono text-sm font-bold text-primary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";
            rowWrapper.appendChild(constInput);

            matrixContainer.appendChild(rowWrapper);
        }
    }

    generateMatrixUI();
    generateBtn.addEventListener('click', generateMatrixUI);

    calculateBtn.addEventListener('click', () => {
        const matrixData = [];
        const constantsData = [];
        const maxIter = parseInt(document.getElementById('max-iter').value);
        
        // Toleransi di-hardcode agar tetap bisa jalan ke backend C++
        const tolerance = 0.001;

        try {
            for (let i = 0; i < currentMatrixSize; i++) {
                const row = [];
                for (let j = 0; j <= currentMatrixSize; j++) {
                    const cell = document.getElementById(`cell-${i}-${j}`);
                    const cellValue = cell.value === '' ? '0' : cell.value;

                    if (j < currentMatrixSize) {
                        row.push(parseFloat(cellValue));
                    } else {
                        constantsData.push(parseFloat(cellValue));
                    }
                }
                matrixData.push(row);
            }

            resultSection.classList.remove('hidden');
            resultOutput.innerHTML = `<span class="animate-pulse text-primary">Menghitung matriks di C++ Core...</span>`;

            fetch('/calculate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ matrix: matrixData, constants: constantsData, tolerance: tolerance, maxIter: maxIter })
            })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    resultOutput.innerHTML = `<span class="text-red-400">❌ Error Backend: ${data.error}</span>`;
                } else {
                    resultOutput.textContent = data.result;
                }
            })
            .catch(err => {
                resultOutput.innerHTML = `<span class="text-red-400">❌ Gagal terhubung ke server Node.js. Pastikan 'node server.js' sudah menyala.</span>`;
            });

        } catch (error) {
            alert("Terjadi kesalahan sistem saat mengambil input matriks.");
        }
    });
});