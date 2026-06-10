#include <iostream>
#include <vector>
#include <cmath>
#include <iomanip>

using namespace std;

int main() {
    int n, maxIter;
    double tolerance;

    // 1. Membaca baris pertama: Ukuran, Toleransi, dan Max Iterasi
    if (!(cin >> n >> tolerance >> maxIter)) {
        cout << "Error: Data input tidak valid.\n";
        return 1;
    }

    vector<vector<double>> A(n, vector<double>(n));
    vector<double> B(n);
    vector<double> X(n, 0.0); // Tebakan awal X adalah 0

    // 2. Membaca baris-baris berikutnya untuk Matriks A (Koefisien)
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            cin >> A[i][j];
        }
        // Validasi pembagian dengan nol di diagonal utama
        if (A[i][i] == 0) {
            cout << "Error Matematika: Elemen diagonal A[" << i+1 << "][" << i+1 << "] bernilai 0. Metode Gauss-Seidel tidak bisa dilanjutkan tanpa pivoting matriks.\n";
            return 1;
        }
    }

    // 3. Membaca baris terakhir untuk Vektor B (Konstanta hasil)
    for (int i = 0; i < n; i++) {
        cin >> B[i];
    }

    // 4. Proses Iterasi Gauss-Seidel
    cout << fixed << setprecision(5);
    cout << "--- Log Komputasi C++ ---\n";

    int iter = 0;
    double max_error = tolerance + 1.0;

    while (iter < maxIter && max_error > tolerance) {
        max_error = 0.0;
        
        for (int i = 0; i < n; i++) {
            double sum = B[i];
            for (int j = 0; j < n; j++) {
                if (i != j) {
                    sum -= A[i][j] * X[j];
                }
            }
            
            double x_new = sum / A[i][i];
            double current_error = abs(x_new - X[i]);
            
            if (current_error > max_error) {
                max_error = current_error;
            }
            X[i] = x_new;
        }
        
        // Cetak progres tiap iterasi
        cout << "Iterasi " << iter + 1 << ": ";
        for (int i = 0; i < n; i++) {
            cout << "X" << i + 1 << "=" << X[i] << "  ";
        }
        cout << "\n";
        
        iter++;
    }

    // 5. Cetak Hasil Akhir
    cout << "\n--- HASIL AKHIR ---\n";
    if (max_error <= tolerance) {
        cout << "Sistem konvergen setelah " << iter << " iterasi.\n";
    } else {
        cout << "Peringatan: Mencapai batas maksimal iterasi (" << maxIter << "). Hasil mungkin belum konvergen sepenuhnya.\n";
    }

    for (int i = 0; i < n; i++) {
        cout << "X" << i + 1 << " = " << X[i] << "\n";
    }

    return 0;
}