/**
 * TooltipInfoComponent – Angular 20 Standalone
 * ─────────────────────────────────────────────────────────────────
 * Molecule that combines an "Information" icon with a Tooltip.
 * The tooltip appears when the user hovers over the icon.
 *
 * @author  : Cristian Quintana / Contact & Business IT
 * @version : 1.0 – 2026/04/17
 *
 * @example
 * <bocc-tooltip-info message="Más información aquí" orientation="right"></bocc-tooltip-info>
 * ─────────────────────────────────────────────────────────────────
 */
import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { TooltipOrientation } from '../../../types/component_type';
import { MasterIconComponent } from '../../atoms/master-icon/master-icon.component';
import { TooltipDirective } from '../../../directives/tooltip.directive';
import { ES_TOOLTIP_INFO } from '../../../utils/lang/es_component';

@Component({
  selector: 'bocc-tooltip-info',
  standalone: true,
  imports: [MasterIconComponent, TooltipDirective],
  templateUrl: './tooltip-info.component.html',
  styleUrl: './tooltip-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipInfoComponent {
  /** Centralized constants from es_component.ts */
  protected readonly ES_TOOLTIP_INFO = ES_TOOLTIP_INFO;

  /** The message to display inside the tooltip */
  readonly message = input.required<string>();

  /** 
   * The orientation of the tooltip relative to the icon.
   * Options: top | bottom | left | right
   */
  readonly orientation = input<TooltipOrientation | string>(TooltipOrientation.Bottom);
}
