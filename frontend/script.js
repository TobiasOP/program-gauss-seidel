document.addEventListener('DOMContentLoaded', () => {
    // Mode State
    let currentMode = 'spl'; // 'spl' atau 'poly'

    // Elemen DOM
    const tabSpl = document.getElementById('tab-spl');
    const tabPoly = document.getElementById('tab-poly');
    const splContainer = document.getElementById('spl-container');
    const polyContainer = document.getElementById('poly-container');
    
    const generateMatrixBtn = document.getElementById('generate-matrix-btn');
    const generatePolyBtn = document.getElementById('generate-poly-btn');
    const calculateBtn = document.getElementById('calculate-btn');
    
    const matrixContainer = document.getElementById('matrix-inputs-container');
    const polyInputsContainer = document.getElementById('poly-inputs-container');
    const resultSection = document.getElementById('result-section');
    const resultOutput = document.getElementById('result-output');

    const SUBSCRIPTS = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];
    let currentMatrixSize = 3;

    // --- TAB SWITCHING LOGIC ---
    tabSpl.addEventListener('click', () => {
        currentMode = 'spl';
        splContainer.classList.remove('hidden');
        polyContainer.classList.add('hidden');
        
        tabSpl.classList.replace('opacity-50', 'opacity-100');
        tabSpl.classList.add('border-primary/50', 'bg-primary/5');
        tabSpl.classList.remove('border-border', 'bg-card');
        
        tabPoly.classList.replace('opacity-100', 'opacity-50');
        tabPoly.classList.remove('border-green-500/50', 'bg-green-500/5');
        tabPoly.classList.add('border-border', 'bg-card');
    });

    tabPoly.addEventListener('click', () => {
        currentMode = 'poly';
        polyContainer.classList.remove('hidden');
        splContainer.classList.add('hidden');
        
        tabPoly.classList.replace('opacity-50', 'opacity-100');
        tabPoly.classList.add('border-green-500/50', 'bg-green-500/5');
        tabPoly.classList.remove('border-border', 'bg-card');
        
        tabSpl.classList.replace('opacity-100', 'opacity-50');
        tabSpl.classList.remove('border-primary/50', 'bg-primary/5');
        tabSpl.classList.add('border-border', 'bg-card');
        
        if (polyInputsContainer.innerHTML === '') generatePolyUI();
    });

    // --- GENERATE UI SPL LANGSUNG ---
    function generateMatrixUI() {
        currentMatrixSize = parseInt(document.getElementById('matrix-size').value);
        if (currentMatrixSize < 2 || currentMatrixSize > 10) return alert("Masukkan ukuran matriks antara 2 hingga 10.");

        matrixContainer.innerHTML = '';
        for (let i = 0; i < currentMatrixSize; i++) {
            const rowWrapper = document.createElement('div');
            rowWrapper.className = "flex items-center gap-2";

            for (let j = 0; j < currentMatrixSize; j++) {
                const input = document.createElement('input');
                input.type = 'number'; input.step = 'any'; input.id = `cell-${i}-${j}`; input.placeholder = "0";
                input.className = "w-16 rounded-lg border border-border bg-background px-3 py-2 text-center font-mono text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";
                rowWrapper.appendChild(input);

                const label = document.createElement('span');
                label.className = "font-mono text-sm font-semibold text-muted-foreground";
                label.textContent = `x${SUBSCRIPTS[j + 1]}`;
                rowWrapper.appendChild(label);

                if (j < currentMatrixSize - 1) {
                    const plusSign = document.createElement('span');
                    plusSign.className = "font-mono text-sm font-bold text-muted-foreground mx-1";
                    plusSign.textContent = "+";
                    rowWrapper.appendChild(plusSign);
                }
            }

            const equalsSpan = document.createElement('span');
            equalsSpan.className = "font-mono text-sm font-bold text-muted-foreground mx-2";
            equalsSpan.textContent = "=";
            rowWrapper.appendChild(equalsSpan);

            const constInput = document.createElement('input');
            constInput.type = 'number'; constInput.step = 'any'; constInput.id = `cell-${i}-${currentMatrixSize}`; constInput.placeholder = "0";
            constInput.className = "w-16 rounded-lg border border-primary/50 bg-primary/5 px-3 py-2 text-center font-mono text-sm font-bold text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";
            rowWrapper.appendChild(constInput);

            matrixContainer.appendChild(rowWrapper);
        }
    }

    // --- GENERATE UI POLINOMIAL ORDE 2 ---
    function generatePolyUI() {
        const n = parseInt(document.getElementById('poly-size').value);
        if (n < 3) return alert("Butuh minimal 3 data untuk regresi orde 2.");

        polyInputsContainer.innerHTML = '';
        for (let i = 0; i < n; i++) {
            const rowDiv = document.createElement('div');
            rowDiv.className = "flex items-center gap-6 border-b border-border/30 pb-4 last:border-0 last:pb-0";
            
            rowDiv.innerHTML = `
                <span class="w-16 text-xs font-bold text-muted-foreground">DATA ${i + 1}</span>
                <div class="flex items-center gap-3">
                    <span class="text-sm font-mono text-muted-foreground">X</span>
                    <input type="number" step="any" id="poly-x-${i}" placeholder="x" class="w-24 rounded-full bg-background border border-border px-4 py-2 text-center font-mono text-sm outline-none focus:border-green-500">
                </div>
                <div class="flex items-center gap-3">
                    <span class="text-sm font-mono text-muted-foreground">Y</span>
                    <input type="number" step="any" id="poly-y-${i}" placeholder="y" class="w-24 rounded-full bg-background border border-border px-4 py-2 text-center font-mono text-sm outline-none focus:border-green-500">
                </div>
            `;
            polyInputsContainer.appendChild(rowDiv);
        }
    }

    // Inisialisasi awal
    generateMatrixUI();
    generateMatrixBtn.addEventListener('click', generateMatrixUI);
    generatePolyBtn.addEventListener('click', generatePolyUI);

    // --- LOGIKA PERHITUNGAN UTAMA ---
    calculateBtn.addEventListener('click', () => {
        const maxIter = parseInt(document.getElementById('max-iter').value);
        const tolerance = 0.001;
        
        let matrixData = [];
        let constantsData = [];

        try {
            if (currentMode === 'spl') {
                // Kumpulkan data matriks biasa
                for (let i = 0; i < currentMatrixSize; i++) {
                    const row = [];
                    for (let j = 0; j <= currentMatrixSize; j++) {
                        const cellVal = parseFloat(document.getElementById(`cell-${i}-${j}`).value || 0);
                        if (j < currentMatrixSize) row.push(cellVal);
                        else constantsData.push(cellVal);
                    }
                    matrixData.push(row);
                }
            } else if (currentMode === 'poly') {
                // Kalkulasi Matriks Regresi Polinomial (Least Squares)
                const n = parseInt(document.getElementById('poly-size').value);
                let sX = 0, sX2 = 0, sX3 = 0, sX4 = 0;
                let sY = 0, sXY = 0, sX2Y = 0;

                for (let i = 0; i < n; i++) {
                    const x = parseFloat(document.getElementById(`poly-x-${i}`).value || 0);
                    const y = parseFloat(document.getElementById(`poly-y-${i}`).value || 0);

                    sX += x; sX2 += x*x; sX3 += Math.pow(x, 3); sX4 += Math.pow(x, 4);
                    sY += y; sXY += x*y; sX2Y += Math.pow(x, 2) * y;
                }

                // Membentuk Matriks A (3x3)
                matrixData = [
                    [n, sX, sX2],
                    [sX, sX2, sX3],
                    [sX2, sX3, sX4]
                ];
                // Membentuk Vektor B
                constantsData = [sY, sXY, sX2Y];
            }

            resultSection.classList.remove('hidden');
            resultOutput.innerHTML = `<span class="animate-pulse text-green-500">Mengirim data ke C++ Core...</span>`;

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
                    let preText = currentMode === 'poly' ? "Hasil a₀, a₁, a₂ untuk Y = a₀ + a₁X + a₂X²\n\n" : "";
                    resultOutput.textContent = preText + data.result;
                }
            })
            .catch(err => {
                resultOutput.innerHTML = `<span class="text-red-400">❌ Gagal terhubung ke server Node.js.</span>`;
            });

        } catch (error) {
            alert("Terjadi kesalahan saat memproses input.");
        }
    });
});