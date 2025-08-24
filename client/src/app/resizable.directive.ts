import { Directive, ElementRef, HostListener, Renderer2, Output, EventEmitter, Input } from '@angular/core';

@Directive({
  selector: '[appResizable]',
  standalone: true
})
export class ResizableDirective {
  @Input() minWidth: number = 100;

  @Output() resize = new EventEmitter<number>();

  private resizing = false;
  private startX = 0;
  private startWidth = 0;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('resizer')) {
      this.resizing = true;
      this.startX = event.pageX;
      this.startWidth = this.el.nativeElement.offsetWidth;
      event.preventDefault(); 
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.resizing) {
      const delta = event.pageX - this.startX;
      const newWidth = this.startWidth + delta;
      
      this.renderer.setStyle(this.el.nativeElement, 'width', `${Math.max(this.minWidth, newWidth)}px`);
    }
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    if (this.resizing) {
      this.resizing = false;
      this.resize.emit(this.el.nativeElement.offsetWidth);
    }
  }
}