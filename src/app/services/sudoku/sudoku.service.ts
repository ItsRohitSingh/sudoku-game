import { Injectable } from '@angular/core';
import { getSudoku } from 'sudoku-gen';
import { BehaviorSubject } from 'rxjs';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface Cell {
    index: number;
    row: number;
    col: number;
    subgrid: number;
    value: number | null;
    solution: number;
    isGiven: boolean;
    isError: boolean;
    isSelected: boolean;
    isRelated: boolean;
    isSameNumber: boolean;
}

export interface GameState {
    board: Cell[];
    difficulty: Difficulty;
    progress: number; // 0 to 100
    isWon: boolean;
    selectedCellIndex: number | null;
}

@Injectable({
    providedIn: 'root'
})
export class SudokuService {
    private gameState = new BehaviorSubject<GameState>({
        board: [],
        difficulty: 'easy',
        progress: 0,
        isWon: false,
        selectedCellIndex: null
    });

    public gameState$ = this.gameState.asObservable();

    constructor() {
        this.startNewGame('easy');
    }

    public startNewGame(difficulty: Difficulty = 'easy') {
        const sudoku = getSudoku(difficulty);
        const board = this.createBoard(sudoku.puzzle, sudoku.solution);

        this.gameState.next({
            board,
            difficulty,
            progress: this.calculateProgress(board),
            isWon: false,
            selectedCellIndex: null
        });
    }

    private createBoard(puzzle: string, solution: string): Cell[] {
        const board: Cell[] = [];
        for (let i = 0; i < 81; i++) {
            const row = Math.floor(i / 9);
            const col = i % 9;
            const subgrid = Math.floor(row / 3) * 3 + Math.floor(col / 3);

            const pVal = puzzle[i] === '-' ? null : parseInt(puzzle[i]);
            const sVal = parseInt(solution[i]);

            board.push({
                index: i,
                row,
                col,
                subgrid,
                value: pVal,
                solution: sVal,
                isGiven: pVal !== null,
                isError: false,
                isSelected: false,
                isRelated: false,
                isSameNumber: false
            });
        }
        return board;
    }

    public selectCell(index: number) {
        const state = this.gameState.value;
        if (state.isWon) return;

        const board = [...state.board];
        const targetCell = board[index];

        // Update selections and highlights
        for (let cell of board) {
            cell.isSelected = cell.index === index;
            cell.isRelated = !cell.isSelected && (cell.row === targetCell.row || cell.col === targetCell.col || cell.subgrid === targetCell.subgrid);
            cell.isSameNumber = !cell.isSelected && cell.value !== null && targetCell.value !== null && cell.value === targetCell.value;
        }

        this.gameState.next({
            ...state,
            board,
            selectedCellIndex: index
        });
    }

    public inputNumber(num: number) {
        const state = this.gameState.value;
        if (state.isWon || state.selectedCellIndex === null) return;

        const targetCell = state.board[state.selectedCellIndex];
        if (targetCell.isGiven) return;

        const board = [...state.board];
        const cell = board[state.selectedCellIndex];

        cell.value = num;
        cell.isError = num !== cell.solution;

        // Refresh highlights
        this.refreshHighlights(board, cell.index);

        const isWon = this.checkWinCondition(board);

        this.gameState.next({
            ...state,
            board,
            progress: this.calculateProgress(board),
            isWon
        });
    }

    public eraseNumber() {
        const state = this.gameState.value;
        if (state.isWon || state.selectedCellIndex === null) return;

        const targetCell = state.board[state.selectedCellIndex];
        if (targetCell.isGiven) return;

        const board = [...state.board];
        const cell = board[state.selectedCellIndex];

        cell.value = null;
        cell.isError = false;

        this.refreshHighlights(board, cell.index);

        this.gameState.next({
            ...state,
            board,
            progress: this.calculateProgress(board)
        });
    }

    public hint() {
        const state = this.gameState.value;
        if (state.isWon || state.selectedCellIndex === null) return;

        const cell = state.board[state.selectedCellIndex];
        if (!cell.isGiven && cell.value !== cell.solution) {
            this.inputNumber(cell.solution);
        }
    }

    private refreshHighlights(board: Cell[], selectedIndex: number) {
        const targetCell = board[selectedIndex];
        for (let cell of board) {
            cell.isSelected = cell.index === selectedIndex;
            cell.isRelated = !cell.isSelected && (cell.row === targetCell.row || cell.col === targetCell.col || cell.subgrid === targetCell.subgrid);
            cell.isSameNumber = !cell.isSelected && cell.value !== null && targetCell.value !== null && cell.value === targetCell.value;
        }
    }

    private calculateProgress(board: Cell[]): number {
        const totalEmpty = board.filter(c => !c.isGiven).length;
        if (totalEmpty === 0) return 100;
        const correctFilled = board.filter(c => !c.isGiven && c.value === c.solution).length;
        return Math.floor((correctFilled / totalEmpty) * 100);
    }

    private checkWinCondition(board: Cell[]): boolean {
        return board.every(c => c.value === c.solution);
    }

    public nextDifficulty() {
        const currentDiff = this.gameState.value.difficulty;
        let next: Difficulty = 'easy';
        if (currentDiff === 'easy') next = 'medium';
        else if (currentDiff === 'medium') next = 'hard';
        else if (currentDiff === 'hard') next = 'expert';
        else next = 'expert'; // stay on expert if won

        this.startNewGame(next);
    }
}
