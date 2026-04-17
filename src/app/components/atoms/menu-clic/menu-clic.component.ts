import { Component, input, output } from '@angular/core';
import { MasterIconComponent } from '../master-icon/master-icon.component';

/**
 * MenuClicComponent
 *
 * An atomic UI component for dropdown and contextual menu items.
 * Adheres to the BOC Design System, supporting hover states, disabled states,
 * and optional directional anchors (chevrons).
 *
 * @example
 * <bocc-menu-clic label="Cambiar prioridad" (itemClick)="onAction()" />
 */
@Component({
  selector: 'bocc-menu-clic',
  standalone: true,
  imports: [MasterIconComponent],
  templateUrl: './menu-clic.component.html',
  styleUrl: './menu-clic.component.scss',
})
export class MenuClicComponent {
  /** The localized text string to display. */
  label = input<string>('');

  /** Toggles the visibility of the trailing chevron icon. */
  showChevron = input<boolean>(true);

  /** Controls interaction availability and visual opacity. */
  disabled = input<boolean>(false);

  /** Notifies parent components when an active item is selected. */
  itemClick = output<void>();

  /**
   * Internal click handler.
   * Prevents emission if the component is in a disabled state.
   */
  handleClick(): void {
    if (!this.disabled()) {
      this.itemClick.emit();
    }
  }
}
