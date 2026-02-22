import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { BoardComponent } from './components/board/board.component';
import { ControlsComponent } from './components/controls/controls.component';
import { TutorialComponent } from './components/tutorial/tutorial.component';
import { SuccessModalComponent } from './components/success-modal/success-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    BoardComponent,
    ControlsComponent,
    TutorialComponent,
    SuccessModalComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  showTutorial = false; // Add a button somewhere for it or show first time
}
