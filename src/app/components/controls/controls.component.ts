import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SudokuService } from '../../services/sudoku/sudoku.service';

@Component({
  selector: 'app-controls',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './controls.component.html',
  styleUrl: './controls.component.css'
})
export class ControlsComponent {
  sudokuService = inject(SudokuService);
  numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  onNumberClick(num: number) {
    this.sudokuService.inputNumber(num);
  }

  onErase() {
    this.sudokuService.eraseNumber();
  }

  onHint() {
    this.sudokuService.hint();
  }
}
