import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  private colorScheme!: 'light' | 'dark';

  // NEW: Public getter to expose the current theme state to components.
  public get isDarkMode(): boolean {
    return this.colorScheme === 'dark';
  }

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
      // Only update if the user hasn't made a manual choice
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
    const htmlElement = document.documentElement;

    if (this.colorScheme === 'dark') {
      this.renderer.addClass(htmlElement, 'dark-mode');
      this.renderer.removeClass(htmlElement, 'light-mode');
    } else {
      this.renderer.addClass(htmlElement, 'light-mode');
      this.renderer.removeClass(htmlElement, 'dark-mode');
    }
  }
}