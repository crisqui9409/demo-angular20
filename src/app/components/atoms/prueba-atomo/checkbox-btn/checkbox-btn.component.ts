import { Component, input, output, viewChild, ElementRef, effect } from '@angular/core';

/**
 * CheckboxBtnComponent
 * 
 * A reusable checkbox component built with Angular Signals.
 * Handles different states: checked, disabled, error, and indeterminate.
 */
@Component({
  selector: 'bocc-checkbox-btn',
  imports: [],
  templateUrl: './checkbox-btn.component.html',
  styleUrl: './checkbox-btn.component.scss',
})
export class CheckboxBtnComponent {
  /** Unique name and ID for the input element */
  name = input<string>('');
  
  /** Value attribute of the checkbox */
  value = input<string>('');
  
  /** Current checked state */
  checked = input<boolean>(false);
  
  /** Text content displayed next to the checkbox */
  sideText = input<string>('');
  
  /** Whether to render the side text */
  showSideText = input<boolean>(true);
  
  /** Prevents user interaction when true */
  disabled = input<boolean>(false);
  
  /** Applies error styles when true */
  error = input<boolean>(false);
  
  /** 
   * Sets the indeterminate state. 
   * Note: This is a visual state and does not affect the 'checked' value.
   */
  indeterminate = input<boolean>(false);

  /** Emits the toggled state when the user interacts with the checkbox */
  checkboxChange = output<boolean>();

  /** Reference to the native checkbox element for DOM manipulation */
  private inputEl = viewChild<ElementRef<HTMLInputElement>>('inputEl');

  /**
   * Synchronizes the native 'indeterminate' DOM property with the internal signal.
   * This is necessary because HTML does not support an 'indeterminate' attribute.
   */
  _effect = effect(() => {
    const el = this.inputEl()?.nativeElement;
    if (el) el.indeterminate = this.indeterminate();
  });

  /**
   * Handles the native change event and notifies parent components.
   * @param event The native DOM event from the input element
   */
  onChange(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.checkboxChange.emit(checked);
  }
}

