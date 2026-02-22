import { Component, inject, HostListener, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild('dropdown') dropdownRef!: ElementRef;
  sudokuService = inject(SudokuService);
  gameState$ = this.sudokuService.gameState$;

  isMenuOpen = false;
  themes = ['Dark', 'Light', 'Sapphire'];

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  setDifficulty(diff: Difficulty) {
    this.sudokuService.startNewGame(diff);
    this.isMenuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.isMenuOpen && this.dropdownRef && !this.dropdownRef.nativeElement.contains(event.target as Node)) {
      this.isMenuOpen = false;
    }
  }
}
