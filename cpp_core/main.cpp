#include <iostream>
#include <vector>
#include <cmath>
#include <iomanip>

using namespace std;

int main() {
    int n, maxIter;
    double tolerance;

    if (!(cin >> n >> tolerance >> maxIter)) {
        cout << "{\"error\": \"Data input tidak valid.\"}";
        return 1;
    }

    vector<vector<double>> A(n, vector<double>(n));
    vector<double> B(n);
    vector<double> X(n, 0.0);

    bool isDominant = true;
    for (int i = 0; i < n; i++) {
        double sumOther = 0;
        for (int j = 0; j < n; j++) {
            cin >> A[i][j];
            if (i != j) sumOther += abs(A[i][j]);
        }
        if (abs(A[i][i]) < sumOther) isDominant = false;
        
        if (A[i][i] == 0) {
            cout << "{\"error\": \"Elemen diagonal bernilai 0. Metode Gauss-Seidel divergen.\"}";
            return 0; // makai 0 agar node.js ga error saat dapat pesan ini
        }
    }

    for (int i = 0; i < n; i++) cin >> B[i];

    cout << fixed << setprecision(5);
    cout << "{";
    cout << "\"isDiagonallyDominant\": " << (isDominant ? "true" : "false") << ",";
    cout << "\"iterations\": [";
    
    // iterasi ke-0 (tebakan awal)
    cout << "[";
    for(int i = 0; i < n; i++) cout << X[i] << (i < n - 1 ? "," : "");
    cout << "]";

    int iter = 0;
    double max_error = tolerance + 1.0;

    while (iter < maxIter && max_error > tolerance) {
        max_error = 0.0;
        for (int i = 0; i < n; i++) {
            double sum = B[i];
            for (int j = 0; j < n; j++) {
                if (i != j) sum -= A[i][j] * X[j];
            }
            double x_new = sum / A[i][i];
            double current_error = abs(x_new - X[i]);
            if (current_error > max_error) max_error = current_error;
            X[i] = x_new;
        }
        
        // print array iterasi
        cout << ",[";
        for(int i = 0; i < n; i++) cout << X[i] << (i < n - 1 ? "," : "");
        cout << "]";
        
        iter++;
    }

    cout << "],";
    cout << "\"converged\": " << (max_error <= tolerance ? "true" : "false") << ",";
    cout << "\"totalIter\": " << iter << ",";
    cout << "\"finalSolution\": [";
    for(int i = 0; i < n; i++) cout << X[i] << (i < n - 1 ? "," : "");
    cout << "]";
    cout << "}\n";

    return 0;
}