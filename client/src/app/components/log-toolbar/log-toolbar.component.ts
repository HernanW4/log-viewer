import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common'; 

@Component({
  selector: 'app-log-toolbar',
  imports: [FormsModule, NgIf], 
  standalone: true,
  templateUrl: './log-toolbar.component.html',
  styleUrls: ['./log-toolbar.component.css']
})
export class LogToolbarComponent {
  @Input() isPaused: boolean = false;
  @Input() filterText: string = '';
  @Input() isChartVisible: boolean = true;
  @Input() isDarkMode: boolean = true;

  @Output() filterChanged = new EventEmitter<string>();
  @Output() pauseToggled = new EventEmitter<void>();
  @Output() clearClicked = new EventEmitter<void>();
  @Output() chartVisibilityToggled = new EventEmitter<void>(); 

  @Output() themeToggled = new EventEmitter<void>();


  public isFilterVisible: boolean = false; 
}