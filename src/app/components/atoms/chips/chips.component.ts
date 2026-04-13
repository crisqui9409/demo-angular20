import { Component, input, output } from '@angular/core';

@Component({
  selector: 'bocc-chips',
  standalone: true,
  imports: [],
  templateUrl: './chips.component.html',
  styleUrl: './chips.component.scss',
})
export class ChipsComponent {
  /** Text to display inside the chip */
  public label = input.required<string>();

  /** Size of the chip */
  public size = input<'xs' | 's' | 'm'>('s');

  /** Whether the chip is in a selected state */
  public selected = input<boolean>(false);

  /** Whether the chip is disabled */
  public disabled = input<boolean>(false);

  /** Whether the chip shows a remove button */
  public removable = input<boolean>(false);

  /** Optional icon name to display before the label */
  public icon = input<string | undefined>();

  /** Event emitted when the remove button is clicked */
  public remove = output<void>();

  /** Handles the removal click */
  public onRemove(event: MouseEvent): void {
    if (this.disabled()) return;
    event.stopPropagation();
    this.remove.emit();
  }
}
