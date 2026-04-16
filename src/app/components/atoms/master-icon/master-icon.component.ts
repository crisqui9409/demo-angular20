/**
 * Component to display a local SVG icon with customizable size and color theme.
 * @author Sebastian Barreto / Contact & Business IT
 * @version 1.0, 2026/04/15 – Initial creation
 *
 * @example
 * <bocc-master-icon name="burger" size="24px" color="brand"></bocc-master-icon>
 */
import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'bocc-master-icon',
  standalone: true,
  imports: [],
  templateUrl: './master-icon.component.html',
  styleUrl: './master-icon.component.scss',
})
export class MasterIconComponent {
  public name = input.required<string>();

  public size = input<string>('24px');

  public color = input<'default' | 'brand' | 'disable'>('default');

  public iconPath = computed(() => `assets/icoins/${this.name()}.svg`);
}
