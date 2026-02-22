import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cell } from '../../services/sudoku/sudoku.service';

@Component({
  selector: 'app-cell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.css'
})
export class CellComponent {
  @Input() cell!: Cell;
  @Output() selectCell = new EventEmitter<number>();

  onClick() {
    this.selectCell.emit(this.cell.index);
  }
}
