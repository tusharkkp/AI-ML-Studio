// Transpose of matrix A (rows x cols -> cols x rows)
export function transpose(A: number[][]): number[][] {
  const rows = A.length;
  if (rows === 0) return [];
  const cols = A[0]!.length;

  const result: number[][] = Array.from({ length: cols }, () => new Array<number>(rows).fill(0));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      result[c]![r] = A[r]![c]!;
    }
  }
  return result;
}

// Matrix Multiplication: C = A (m x k) * B (k x n) -> (m x n)
export function multiplyMatrix(A: number[][], B: number[][]): number[][] {
  const m = A.length;
  if (m === 0) return [];
  const k = A[0]!.length;
  const n = B[0]!.length;

  const result: number[][] = Array.from({ length: m }, () => new Array<number>(n).fill(0));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      let sum = 0;
      for (let p = 0; p < k; p++) {
        sum += A[i]![p]! * B[p]![j]!;
      }
      result[i]![j] = sum;
    }
  }
  return result;
}

// Matrix-Vector Multiplication: y = A (m x n) * v (n) -> (m)
export function multiplyVector(A: number[][], v: number[]): number[] {
  const m = A.length;
  if (m === 0) return [];
  const n = v.length;

  const result: number[] = new Array<number>(m).fill(0);
  for (let i = 0; i < m; i++) {
    let sum = 0;
    for (let j = 0; j < n; j++) {
      sum += A[i]![j]! * v[j]!;
    }
    result[i] = sum;
  }
  return result;
}

// Matrix Inversion via Gauss-Jordan Elimination with Partial Pivoting
export function invertMatrix(A: number[][]): {
  inverse: number[][];
  isSingular: boolean;
  determinant: number;
} {
  const n = A.length;
  if (n === 0 || A[0]!.length !== n) {
    return { inverse: [], isSingular: true, determinant: 0 };
  }

  // Clone augmented matrix [A | I]
  const aug: number[][] = [];
  for (let i = 0; i < n; i++) {
    const row = new Array<number>(2 * n).fill(0);
    for (let j = 0; j < n; j++) {
      row[j] = A[i]![j]!;
    }
    row[n + i] = 1;
    aug.push(row);
  }

  let det = 1;

  for (let i = 0; i < n; i++) {
    // Find pivot row
    let maxRow = i;
    let maxVal = Math.abs(aug[i]![i]!);
    for (let k = i + 1; k < n; k++) {
      const val = Math.abs(aug[k]![i]!);
      if (val > maxVal) {
        maxVal = val;
        maxRow = k;
      }
    }

    // Singular matrix check
    if (maxVal < 1e-12) {
      return { inverse: [], isSingular: true, determinant: 0 };
    }

    // Swap rows if needed
    if (maxRow !== i) {
      const temp = aug[i]!;
      aug[i] = aug[maxRow]!;
      aug[maxRow] = temp;
      det = -det;
    }

    const pivot = aug[i]![i]!;
    det *= pivot;

    // Scale pivot row so pivot element becomes 1
    const pivotRow = aug[i]!;
    for (let j = 0; j < 2 * n; j++) {
      pivotRow[j] = (pivotRow[j] ?? 0) / pivot;
    }

    // Eliminate other rows
    for (let r = 0; r < n; r++) {
      if (r !== i) {
        const rowR = aug[r]!;
        const factor = rowR[i] ?? 0;
        if (Math.abs(factor) > 1e-14) {
          for (let c = 0; c < 2 * n; c++) {
            rowR[c] = (rowR[c] ?? 0) - factor * (pivotRow[c] ?? 0);
          }
        }
      }
    }
  }

  // Extract right half as inverse matrix
  const inverse: number[][] = [];
  for (let i = 0; i < n; i++) {
    inverse.push(aug[i]!.slice(n));
  }

  return { inverse, isSingular: false, determinant: det };
}
