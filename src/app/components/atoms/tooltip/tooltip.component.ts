/**
 * Component to display a floating tooltip message.
 * Supports collision detection and dynamic orientation.
 *
 * @author  : Cristian Quintana / Contact & Business IT
 * @version : 1.0 – 2026/04/17
 *
 * @example
 * <bocc-tooltip message="Ayuda" orientation="top" [isVisible]="true"></bocc-tooltip>
 */
import { 
  Component, 
  input, 
  model, 
  effect, 
  ChangeDetectionStrategy, 
  HostListener,
  untracked
} from '@angular/core';
import { TooltipOrientation } from '../../../types/component_type';
import { DEFAULT_CONST } from '../../../utils/global-strings';

@Component({
  selector: 'bocc-tooltip',
  standalone: true,
  imports: [],
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss',
  host: {
    '[class]': '"orientation-" + (finalOrientation() || orientation())',
    '[class.is-visible]': 'isVisible()',
    '[style.top.px]': 'y() !== null ? y() : undefined',
    '[style.left.px]': 'x() !== null ? x() : undefined',
    '[style.--tooltip-arrow-shift-x.px]': 'arrowShiftX()',
    '[style.--tooltip-arrow-shift-y.px]': 'arrowShiftY()'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipComponent {
  /** Text message to display */
  readonly message = input<string>(DEFAULT_CONST.EMPTY);

  /** Position of the tooltip relative to the trigger */
  readonly orientation = input<TooltipOrientation | string>(TooltipOrientation.Bottom);

  /** Visibility control managed by the parent */
  readonly isVisible = input<boolean>(false);

  /** X Coordinate for fixed positioning (now a model to allow internal/external updates) */
  readonly x = model<number | null>(null);

  /** Y Coordinate for fixed positioning (now a model to allow internal/external updates) */
  readonly y = model<number | null>(null);

  /** 
   * Optional anchor element for auto-positioning.
   * If provided, the tooltip will calculate its own coordinates.
   */
  readonly anchorElement = input<HTMLElement | null>(null);

  /** Horizontal shift for the arrow to maintain alignment */
  readonly arrowShiftX = model<number>(0);
  
  /** Vertical shift for the arrow (rarely used but supported) */
  readonly arrowShiftY = model<number>(0);

  /** Calculated orientation after collision detection */
  readonly finalOrientation = model<TooltipOrientation | string>('');

  constructor() {
    /**
     * Effect to recalculate position whenever relevant inputs change.
     */
    effect(() => {
      const anchor = this.anchorElement();
      const visible = this.isVisible();
      const orientation = this.orientation();
      const message = this.message();

      if (anchor && visible) {
        untracked(() => this.calculatePosition(anchor, orientation));
      }
    });
  }

  /**
   * Listen to window events to maintain alignment while scrolling or resizing.
   */
  @HostListener('window:scroll')
  @HostListener('window:resize')
  onWindowChange(): void {
    const anchor = this.anchorElement();
    if (anchor && this.isVisible()) {
      this.calculatePosition(anchor, this.orientation());
    }
  }

  /**
   * Logic to calculate the absolute position with collision detection.
   */
  private calculatePosition(anchor: HTMLElement, orientation: TooltipOrientation | string): void {
    const iconChild = anchor.querySelector('img, svg, i');
    const targetElement = iconChild || anchor;
    
    const rect = targetElement.getBoundingClientRect();
    const scrollX = window.scrollX || document.documentElement.scrollLeft;
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Approximate dimensions (width is 15rem = 240px)
    const tooltipWidth = 240;
    const tooltipHeight = 80; // Estimated height
    const padding = 16;

    let computedOrientation = orientation;
    let newX = 0;
    let newY = 0;

    // 1. Flip Logic (Vertical)
    if (orientation === TooltipOrientation.Bottom || orientation === 'bottom') {
      if (rect.bottom + tooltipHeight > viewportHeight && rect.top > tooltipHeight) {
        computedOrientation = TooltipOrientation.Top;
      }
    } else if (orientation === TooltipOrientation.Top || orientation === 'top') {
      if (rect.top - tooltipHeight < 0 && (viewportHeight - rect.bottom) > tooltipHeight) {
        computedOrientation = TooltipOrientation.Bottom;
      }
    }

    this.finalOrientation.set(computedOrientation);

    // 2. Base Coordinates
    switch (computedOrientation) {
      case TooltipOrientation.Top:
      case 'top':
        newX = rect.left + rect.width / 2 + scrollX;
        newY = rect.top + scrollY;
        break;
      case TooltipOrientation.Bottom:
      case 'bottom':
        newX = rect.left + rect.width / 2 + scrollX;
        newY = rect.bottom + scrollY;
        break;
      case TooltipOrientation.Left:
      case 'left':
        newX = rect.left + scrollX;
        newY = rect.top + rect.height / 2 + scrollY;
        break;
      case TooltipOrientation.Right:
      case 'right':
        newX = rect.right + scrollX;
        newY = rect.top + rect.height / 2 + scrollY;
        break;
    }

    // 3. Boundary Detection (Horizontal Shift)
    let adjustedX = newX;
    let shiftX = 0;

    if (computedOrientation === TooltipOrientation.Top || computedOrientation === TooltipOrientation.Bottom || 
        computedOrientation === 'top' || computedOrientation === 'bottom') {
      
      const leftBoundary = (newX - tooltipWidth / 2) - scrollX;
      const rightBoundary = (newX + tooltipWidth / 2) - scrollX;

      if (leftBoundary < padding) {
        shiftX = padding - leftBoundary;
      } else if (rightBoundary > viewportWidth - padding) {
        shiftX = (viewportWidth - padding) - rightBoundary;
      }
    }

    adjustedX += shiftX;
    
    // The arrow shift is opposite to the bubble shift to stay glued to the anchor center
    this.arrowShiftX.set(-shiftX);
    this.x.set(adjustedX);
    this.y.set(newY);
  }
}

