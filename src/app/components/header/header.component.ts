import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SudokuService, Difficulty } from '../../services/sudoku/sudoku.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  sudokuService = inject(SudokuService);
  gameState$ = this.sudokuService.gameState$;

  isMenuOpen = false;
  themes = ['Dark', 'Light', 'Sapphire'];

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  setDifficulty(diff: Difficulty) {
    this.sudokuService.startNewGame(diff);
    this.isMenuOpen = false;
  }
}
