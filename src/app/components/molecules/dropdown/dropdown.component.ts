/**
 * A flexible dropdown component that uses atoms to build a premium selection experience with search.
 * @author Sebastian Barreto / Contact & Business IT
 * @version 1.0, 2026/04/20 – Initial creation
 *
 * @example
 * <bocc-dropdown 
 *   [label]="'Seleccionar opción'" 
 *   [options]="['Opción A', 'Opción B']"
 *   (optionSelected)="onSelected($event)">
 * </bocc-dropdown>
 */
import { Component, input, output, signal, HostListener, ElementRef, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuClicComponent } from '../../atoms/menu-clic/menu-clic.component';
import { InputTextComponent } from '../../atoms/input-text/input-text.component';
import { TextLinkComponent } from '../../atoms/text-link/text-link.component';

@Component({
  selector: 'bocc-dropdown',
  standalone: true,
  imports: [CommonModule, MenuClicComponent, InputTextComponent, TextLinkComponent],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
})
export class DropdownComponent {
  /** Text to display on the dropdown trigger. */
  public label = input<string>('Seleccionar');

  /** Placeholder text when no selection is made (optional). */
  public placeholder = input<string>('');

  /** List of options to display in the menu. */
  public options = input<string[]>([]);

  /** Disables the dropdown interaction. */
  public disabled = input<boolean>(false);

  /** Controls if the "Eliminar" (clear) button should be displayed. */
  public showClear = input<boolean>(true);

  /** Emits the selected option label. */
  public optionSelected = output<string>();

  /** Internal state to track if the menu is open. */
  public isOpen = signal<boolean>(false);

  /** Filter term for searching options. */
  public searchTerm = signal<string>('');

  /** The currently selected value label. */
  public selectedValue = signal<string | null>(null);

  /** Computed list of options filtered by the search term. */
  public filteredOptions = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) {
      return this.options();
    }
    return this.options().filter(option =>
      option.toLowerCase().includes(term)
    );
  });

  constructor(private elementRef: ElementRef) { }

  /**
   * Toggles the open/closed state of the dropdown menu.
   */
  public toggleDropdown(): void {
    if (!this.disabled()) {
      this.isOpen.update(v => !v);
    }
  }

  /**
   * Handles text input for filtering.
   * @param value Current text in the input.
   */
  public onSearchInput(value: string): void {
    this.searchTerm.set(value);

    // Clear selection if the user modifies the input manually and it no longer matches the selection
    if (value !== this.selectedValue()) {
      this.selectedValue.set(null);
    }

    if (!this.isOpen()) {
      this.isOpen.set(true);
    }
  }

  /**
   * Handles the selection of an option from the menu.
   * @param option The selected option text.
   */
  public handleOptionClick(option: string): void {
    this.selectedValue.set(option);
    this.searchTerm.set(option);
    this.optionSelected.emit(option);
    this.isOpen.set(false);
  }

  /**
   * Clears the current search and selection.
   */
  public clearSearch(): void {
    this.searchTerm.set('');
    this.selectedValue.set(null);
    this.isOpen.set(false);
  }

  /**
   * Closes the dropdown when clicking outside the component.
   */
  @HostListener('document:click', ['$event'])
  public handleClickOutside(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
}
