/**
 * Component to display a local SVG icon with customizable size and color theme.
 * @author Sebastian Barreto / Contact & Business IT
 * @version 1.0, 2026/04/15 – Initial creation
 *
 * @author Cristian Quintana / Contact & Business IT
 * @version 1.1, 2026/04/20 – Add color input
 *
 * @example
 * <bocc-master-icon name="logo_boc" [useMask]="false" size="100px"></bocc-master-icon>
 * <bocc-master-icon name="icon-search" size="32px" color="brand"></bocc-master-icon>
 */
import { Component, computed, input, ChangeDetectionStrategy } from '@angular/core';
import { MasterIconColor } from '../../../types/component_type';

@Component({
  selector: 'bocc-master-icon',
  standalone: true,
  imports: [],
  templateUrl: './master-icon.component.html',
  styleUrl: './master-icon.component.scss',
  host: {
    '[class.bocc-master-icon]': 'true',
    '[class.bocc-master-icon--no-mask]': '!useMask()',
    '[class]': 'colorClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MasterIconComponent {
  /** Enables or disables the CSS mask strategy. Set to false for multi-colored icons. */
  readonly useMask = input<boolean>(true);

  /** Name of the SVG file (without extension) */
  readonly name = input.required<string>();

  public size = input<string>('24px');

  public color = input<MasterIconColor>('default');

  public iconPath = computed(() => `assets/icons/${this.name()}.svg`);

  /** Generates the dynamic color class to avoid hardcoding in the template */
  public colorClass = computed(() => `bocc-master-icon--${this.color()}`);
}
