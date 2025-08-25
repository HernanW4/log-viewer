import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  private colorScheme!: 'light' | 'dark';

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  detectInitialTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.colorScheme = savedTheme as 'light' | 'dark';
    } else {
      this.colorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    this.updateTheme();
  }

  listenForThemeChanges() {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      const newColorScheme = e.matches ? 'dark' : 'light';
      if (!localStorage.getItem('theme')) {
        this.colorScheme = newColorScheme;
        this.updateTheme();
      }
    });
  }

  toggleTheme(): void {
    this.colorScheme = this.colorScheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', this.colorScheme);
    this.updateTheme();
  }

  private updateTheme(): void {
    if (this.colorScheme === 'dark') {
      this.renderer.addClass(document.body, 'dark-mode');
      this.renderer.removeClass(document.body, 'light-mode');
    } else {
      this.renderer.addClass(document.body, 'light-mode');
      this.renderer.removeClass(document.body, 'dark-mode');
    }
  }
}