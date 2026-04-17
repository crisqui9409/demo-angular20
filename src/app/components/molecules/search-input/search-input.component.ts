import { Component, input, model, output } from '@angular/core';
import { MasterIconComponent } from '../../atoms/master-icon/master-icon.component';

/** Drives border color and feedback text. Maps directly to CSS status modifier classes. */
export type SearchInputStatus = 'default' | 'success' | 'warning' | 'error';

/**
 * Atomic search input aligned with the BOC Design System.
 *
 * Supports two-way value binding, dynamic icons via bocc-master-icon names,
 * four validation states, and a disabled mode.
 *
 * @example
 * <bocc-search-input label="Convenio" [(value)]="term" leftIconName="filter" />
 */
@Component({
  selector: 'bocc-search-input',
  standalone: true,
  imports: [MasterIconComponent],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
})
export class SearchInputComponent {
  // Content

  label = input<string>('');
  hint = input<string>('');
  placeholder = input<string>('Buscar…');
  prefix = input<string>('');

  /** Validation message rendered below the input box. Visibility is tied to this value being non-empty. */
  feedbackMessage = input<string>('');

  // Icons — pass a name from assets/icoins/ to render via bocc-master-icon.

  /** Icon name from assets/icoins/ to display on the left side (non-interactive).
   *  Leave empty to hide the icon. */
  leftIconName = input<string>('');

  /** Renders a clickable search button on the right side. */
  showSearchIcon = input<boolean>(true);
  rightIcon = input<string>('');

  /** Overrides the built-in info icon shown next to the label. */
  infoIcon = input<string>('');

  /** Overrides the built-in icon shown next to the feedback message. */
  feedbackIcon = input<string>('');

  // State

  status = input<SearchInputStatus>('default');
  disabled = input<boolean>(false);

  // Value

  /** Two-way bindable search term. Use [(value)]="myTerm" in the parent. */
  value = model<string>('');

  // Events

  /** Emits the current value when the user presses Enter or clicks the search icon. */
  searchTriggered = output<string>();

  onInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
  }

  /** Guard prevents emission when the field is disabled, even if called programmatically. */
  onSearch(): void {
    if (!this.disabled()) {
      this.searchTriggered.emit(this.value());
    }
  }
}
