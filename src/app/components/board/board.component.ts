import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CellComponent } from '../cell/cell.component';
import { SudokuService } from '../../services/sudoku/sudoku.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, CellComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {
  sudokuService = inject(SudokuService);
  gameState$ = this.sudokuService.gameState$;

  onSelectCell(index: number) {
    this.sudokuService.selectCell(index);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    const key = event.key;
    if (['1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(key)) {
      this.sudokuService.inputNumber(parseInt(key, 10));
    } else if (key === 'Backspace' || key === 'Delete') {
      this.sudokuService.eraseNumber();
    } else if (key === 'ArrowUp') {
      this.navigate(-9);
    } else if (key === 'ArrowDown') {
      this.navigate(9);
    } else if (key === 'ArrowLeft') {
      this.navigate(-1);
    } else if (key === 'ArrowRight') {
      this.navigate(1);
    }
  }

  private navigate(offset: number) {
    const state = this.sudokuService['gameState'].value; // Access internal behavior subject value directly (read-only)
    if (state.selectedCellIndex === null) {
      this.sudokuService.selectCell(40); // Center start
      return;
    }

    let newIndex = state.selectedCellIndex + offset;
    // Basic bounds checking for arrow keys
    if (offset === 1 && newIndex % 9 === 0) newIndex -= 9; // wrap around row
    if (offset === -1 && (newIndex + 1) % 9 === 0) newIndex += 9; // wrap around row
    if (newIndex >= 0 && newIndex < 81) {
      this.sudokuService.selectCell(newIndex);
    }
  }
}
