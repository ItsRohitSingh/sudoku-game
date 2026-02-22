import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SudokuService } from '../../services/sudoku/sudoku.service';

@Component({
  selector: 'app-success-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './success-modal.component.html',
  styleUrl: './success-modal.component.css'
})
export class SuccessModalComponent {
  sudokuService = inject(SudokuService);
  gameState$ = this.sudokuService.gameState$;

  onNextPuzzle() {
    this.sudokuService.nextDifficulty();
  }
}
