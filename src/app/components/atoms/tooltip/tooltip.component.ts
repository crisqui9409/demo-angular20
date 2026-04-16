/**
 * TooltipComponent – Angular 20 Standalone
 * ─────────────────────────────────────────────────────────────────
 * Independent tooltip atom. Displays a floating text balloon in
 * one of four orientations (top, bottom, left, right).
 * Controlled externally by binding the isVisible input 
 * from a parent component.
 *
 * @author  : Cristian Quintana / Contact & Business IT
 * @version : 1.0 – 2026/04/13 
 * ─────────────────────────────────────────────────────────────────
 */
import { Component, input, signal, ChangeDetectionStrategy } from '@angular/core';
import { TooltipOrientation } from '../../../types/component_type';
import { DEFAULT_CONST } from '../../../utils/global-strings';

@Component({
  selector: 'bocc-tooltip',
  standalone: true,
  imports: [],
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss',
  host: {
    '[class]': '"orientation-" + orientation()',
    '[class.is-visible]': 'isVisible()',
    '[style.top.px]': 'y()',
    '[style.left.px]': 'x()'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipComponent {
  /** Text message to display */
  readonly message = input<string>(DEFAULT_CONST.EMPTY);

  /** Position of the tooltip relative to the trigger */
  readonly orientation = input<TooltipOrientation>(TooltipOrientation.Bottom);

  /** X Coordinate for fixed positioning */
  readonly x = signal<number>(0);

  /** Y Coordinate for fixed positioning */
  readonly y = signal<number>(0);

  /** Visibility control managed by the parent */
  readonly isVisible = input<boolean>(false);
}
