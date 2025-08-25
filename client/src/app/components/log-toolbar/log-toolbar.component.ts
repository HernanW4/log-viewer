import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-log-toolbar',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './log-toolbar.component.html',
  styleUrls: ['./log-toolbar.component.css']
})
export class LogToolbarComponent {
  @Input() isPaused: boolean = false;
  @Input() autoScroll: boolean = true;
  @Input() filterText: string = '';

  @Output() filterChanged = new EventEmitter<string>();
  @Output() pauseToggled = new EventEmitter<void>();
  @Output() stopClicked = new EventEmitter<void>();
  @Output() clearClicked = new EventEmitter<void>();
  @Output() autoScrollChanged = new EventEmitter<boolean>();
}