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
import { DEFAULT_CONST } from '../utils/global-strings';

@Directive({
  selector: '[boccTooltip]',
  standalone: true
})
export class TooltipDirective implements OnDestroy {
  /** Tooltip message text */
  @Input('boccTooltip') message: string = DEFAULT_CONST.EMPTY;

  /** Orientation of the tooltip (top, bottom, left, right) */
  @Input() orientation: TooltipOrientation | string = TooltipOrientation.Bottom;

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

  private showTooltip(): void {
    if (!this.componentRef) {
      // 1. Create the component dynamically at the root level
      this.componentRef = createComponent(TooltipComponent, {
        environmentInjector: this.injector
      });

      // 2. Pass inputs - Notice we now pass the anchorElement
      this.componentRef.setInput('message', this.message);
      this.componentRef.setInput('orientation', this.orientation);
      this.componentRef.setInput('anchorElement', this.elementRef.nativeElement);
      this.componentRef.setInput('isVisible', true);

      // 3. Attach to application (for change detection to work)
      this.appRef.attachView(this.componentRef.hostView);

      // 4. Append to body
      const domElem = (this.componentRef.hostView as any).rootNodes[0] as HTMLElement;
      document.body.appendChild(domElem);
    }
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

