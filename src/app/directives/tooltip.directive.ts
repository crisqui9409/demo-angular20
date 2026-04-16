import { 
  Directive, 
  ElementRef, 
  HostListener, 
  Input, 
  OnDestroy, 
  ComponentRef,
  ApplicationRef,
  createComponent,
  EnvironmentInjector
} from '@angular/core';
import { TooltipComponent } from '../components/atoms/tooltip/tooltip.component';
import { TooltipOrientation } from '../types/component_type';

@Directive({
  selector: '[boccTooltip]',
  standalone: true
})
export class TooltipDirective implements OnDestroy {
  /** Tooltip message text */
  @Input('boccTooltip') message: string = '';

  /** Orientation of the tooltip (top, bottom, left, right) */
  @Input() orientation: TooltipOrientation = TooltipOrientation.Bottom;

  private componentRef: ComponentRef<TooltipComponent> | null = null;

  constructor(
    private elementRef: ElementRef,
    private appRef: ApplicationRef,
    private injector: EnvironmentInjector
  ) {}

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.showTooltip();
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.hideTooltip();
  }

  @HostListener('focusin')
  onFocusIn(): void {
    this.showTooltip();
  }

  @HostListener('focusout')
  onFocusOut(): void {
    this.hideTooltip();
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  onWindowChange(): void {
    if (this.componentRef) {
      this.updatePosition();
    }
  }

  private showTooltip(): void {
    if (!this.componentRef) {
      // 1. Create the component dynamically at the root level
      this.componentRef = createComponent(TooltipComponent, {
        environmentInjector: this.injector
      });

      // 2. Pass inputs
      this.componentRef.setInput('message', this.message);
      this.componentRef.setInput('orientation', this.orientation);
      this.componentRef.setInput('isVisible', true);

      // 3. Attach to application (for change detection to work)
      this.appRef.attachView(this.componentRef.hostView);

      // 4. Append to body
      const domElem = (this.componentRef.hostView as any).rootNodes[0] as HTMLElement;
      document.body.appendChild(domElem);

      // 5. Calculate and set initial position
      this.updatePosition();
    }
  }

  private updatePosition(): void {
    if (!this.componentRef) return;

    // FIND CORE ELEMENT: Target the icon specifically within the container
    const host = this.elementRef.nativeElement as HTMLElement;
    const iconChild = host.querySelector('img, svg, i');
    const targetElement = iconChild || host;
    
    // getBoundingClientRect is relative to viewport
    const rect = targetElement.getBoundingClientRect();
    
    // We use ABSOLUTE positioning relative to document.body
    // So we must add window scroll to the viewport-relative rect
    const scrollX = window.scrollX || document.documentElement.scrollLeft;
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    let x = 0;
    let y = 0;

    // Anchor points based on orientation (0px gap relative to the edge)
    switch (this.orientation) {
      case 'top':
        x = rect.left + rect.width / 2 + scrollX;
        y = rect.top + scrollY;
        break;
      case 'bottom':
        x = rect.left + rect.width / 2 + scrollX;
        y = rect.bottom + scrollY;
        break;
      case 'left':
        x = rect.left + scrollX;
        y = rect.top + rect.height / 2 + scrollY;
        break;
      case 'right':
        x = rect.right + scrollX;
        y = rect.top + rect.height / 2 + scrollY;
        break;
    }

    // Update signals in the component
    this.componentRef.instance.x.set(x);
    this.componentRef.instance.y.set(y);
  }

  private hideTooltip(): void {
    if (this.componentRef) {
      // Detach and destroy
      this.appRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }

  ngOnDestroy(): void {
    this.hideTooltip();
  }
}
