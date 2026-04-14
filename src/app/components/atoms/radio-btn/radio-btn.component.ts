import { Component, input, output } from '@angular/core';

/**
 * Radio button atom component utilizing Angular Signals for state management.
 * Provides a highly performant and accessible single-selection input.
 */
@Component({
  selector: 'bocc-radio-btn',
  standalone: true,
  imports: [],
  templateUrl: './radio-btn.component.html',
  styleUrl: './radio-btn.component.scss',
})
export class RadioBtnComponent {
  /** Base name for the radio group and unique instance identification. */
  name = input<string>('');

  /** Unique value identifier for this specific radio option. */
  value = input<string>('');

  /** Input signal representing the selection state. */
  checked = input<boolean>(false);

  /** Label text content displayed adjacent to the component. */
  sideText = input<string>('');

  /** Conditional toggle for side text visibility. */
  showSideText = input<boolean>(true);

  /** Disables user interaction and applies muted visual styles. */
  disabled = input<boolean>(false);

  /** Indicates an invalid state with corresponding visual feedback. */
  error = input<boolean>(false);

  /** Emits the selection state to the parent on user interaction. */
  radioChange = output<boolean>();

  /**
   * Propagates changes from the native input to parent components.
   * @param event Native browser change event.
   */
  onChange(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.radioChange.emit(isChecked);
  }
}

