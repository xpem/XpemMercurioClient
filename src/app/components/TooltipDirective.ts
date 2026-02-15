import { Directive, ElementRef, Inject, PLATFORM_ID, OnInit, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appTooltip]',
  standalone: true
})
export class TooltipDirective implements OnInit, OnDestroy {
  private tooltipInstance: any;

  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async ngOnInit() {
    // 💡 O segredo do SSR: Verificar se estamos no navegador
    if (isPlatformBrowser(this.platformId)) {
      // Import dinâmico do Bootstrap para evitar erros no servidor
      const bootstrap = await import('bootstrap');
      this.tooltipInstance = new bootstrap.Tooltip(this.el.nativeElement);
    }
  }

  ngOnDestroy() {
    // Limpar o tooltip para evitar vazamento de memória
    if (this.tooltipInstance) {
      this.tooltipInstance.dispose();
    }
  }
}