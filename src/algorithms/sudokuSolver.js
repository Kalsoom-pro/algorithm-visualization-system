export function sudokuSolver(userBoard) {
    const steps = [];

    const initialBoard = userBoard ? JSON.parse(JSON.stringify(userBoard)) : [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ];

    steps.push({
        board: JSON.parse(JSON.stringify(initialBoard)),
        explanation: 'Start',
        description: 'Starting Sudoku Solver',
        row: -1,
        col: -1,
        reason: ''
    });

    function isValid(board, row, col, num) {
        // Check row
        for (let i = 0; i < 9; i++) {
            if (board[row][i] === num) {
                return { valid: false, reason: `${num} already exists in row ${row + 1}` };
            }
        }

        // Check column
        for (let i = 0; i < 9; i++) {
            if (board[i][col] === num) {
                return { valid: false, reason: `${num} already exists in column ${col + 1}` };
            }
        }

        // Check 3x3 box
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[boxRow + i][boxCol + j] === num) {
                    return { valid: false, reason: `${num} already exists in the 3x3 box` };
                }
            }
        }

        return { valid: true, reason: '' };
    }

    function solve(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        const validation = isValid(board, row, col, num);

                        steps.push({
                            board: JSON.parse(JSON.stringify(board)),
                            explanation: 'Try',
                            description: `Trying ${num} at position (${row + 1}, ${col + 1})`,
                            row: row,
                            col: col,
                            reason: validation.valid ? `Checking if ${num} can be placed` : validation.reason
                        });

                        if (validation.valid) {
                            board[row][col] = num;

                            steps.push({
                                board: JSON.parse(JSON.stringify(board)),
                                explanation: 'Place',
                                description: `Placed ${num} at (${row + 1}, ${col + 1})`,
                                row: row,
                                col: col,
                                reason: `Successfully placed ${num}`
                            });

                            if (solve(board)) {
                                return true;
                            }

                            board[row][col] = 0;
                            steps.push({
                                board: JSON.parse(JSON.stringify(board)),
                                explanation: 'Backtrack',
                                description: `Backtracking from (${row + 1}, ${col + 1}) - removing ${num}`,
                                row: row,
                                col: col,
                                reason: `No valid number works at this position, backtracking to try different combination`
                            });
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    const boardCopy = JSON.parse(JSON.stringify(initialBoard));
    solve(boardCopy);

    steps.push({
        board: boardCopy,
        explanation: 'Complete',
        description: 'Sudoku Solved Successfully!',
        row: -1,
        col: -1,
        reason: 'All cells filled correctly'
    });

    return steps;
}