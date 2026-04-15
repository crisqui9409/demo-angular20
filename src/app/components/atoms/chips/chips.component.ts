/**
 * Component to display small blocks of information, filters, or status indicators.
 * @author Sebastian Barreto / Contact & Business IT
 * @version 1.0, 2026/04/14 – Migrated to Angular 20 standalone + signals
 *
 * @example
 * <bocc-chips label="Active" icon="check" [selected]="true"></bocc-chips>
 */
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'bocc-chips',
  standalone: true,
  imports: [],
  templateUrl: './chips.component.html',
  styleUrl: './chips.component.scss',
})
export class ChipsComponent {
  public label = input.required<string>();

  public size = input<'xs' | 's' | 'm'>('s');

  public selected = input<boolean>(false);

  public disabled = input<boolean>(false);

  public removable = input<boolean>(false);

  public icon = input<string | undefined>();

  public remove = output<void>();

  public onRemove(event: MouseEvent): void {
    if (this.disabled()) return;
    event.stopPropagation();
    this.remove.emit();
  }
}
