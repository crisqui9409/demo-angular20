/**
 * InputSelectComponent – Angular 20 Standalone
 * ─────────────────────────────────────────────────────────────────
 * Dropdown select atom.
 * Design reference: Figma "BOC (Dev)" – Section 11. Dropdown
 *
 * Author  : Cristian Quintana / Contact & Business IT
 * Version : 2.0 – 2026/04/13 (Angular 20 rewrite with signals)
 * ─────────────────────────────────────────────────────────────────
 */
import {
  Component,
  DestroyRef,
  HostListener,
  OnInit,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

import { SelectCoordinatorService } from '../../../services/select-coordinator.service';
import { DEFAULT_CONST, VAR_INPUT_FORM } from '../../../utils/global-strings';

@Component({
  selector: 'bocc-input-select',
  standalone: true,
  imports: [],
  templateUrl: './input-select.component.html',
  styleUrl: './input-select.component.scss',
})
export class InputSelectComponent implements OnInit {

  // ── DI ────────────────────────────────────────────────────────────────────
  private readonly coordinator = inject(SelectCoordinatorService);
  private readonly destroyRef  = inject(DestroyRef);

  // ── Inputs ────────────────────────────────────────────────────────────────

  /** List of options shown in the dropdown. */
  readonly optionsValues = input<string[]>([]);

  /** Disables the whole component when true. */
  readonly isDisable = input<boolean>(false);

  /** Label text shown above the input when a value is selected. */
  readonly titleName = input<string>(DEFAULT_CONST.EMPTY);

  /** HTML name attribute for the internal input. */
  readonly name = input<string>(DEFAULT_CONST.EMPTY);

  /**
   * Index of the option that should be pre-selected on init.
   * -1 means no pre-selection.
   */
  readonly activeOption = input<number>(-1);

  /** Activates the error visual state. */
  readonly hasError = input<boolean>(false);

  /** Message shown below the input when hasError is true. */
  readonly errorMessage = input<string>(DEFAULT_CONST.EMPTY);

  /**
   * When set to true, resets the displayed value back to the placeholder.
   * The parent must set it back to false after reset.
   */
  readonly returnToDefault = input<boolean>(false);

  /** Text shown before the user makes a selection. */
  readonly placeholder = input<string>('Selecciona');

  /** Show a "Selecciona" dummy item at the top of the option list. */
  readonly selectOption = input<boolean>(false);

  // ── Outputs ───────────────────────────────────────────────────────────────

  /** Emits the value and its index whenever an option is chosen. */
  readonly handleInput   = output<{ value: string; numberTab: number }>();
  /** Same event with a more descriptive name. */
  readonly onSelectOption = output<{ value: string; index: number }>();

  // ── Internal state ────────────────────────────────────────────────────────

  readonly showDropdown        = signal<boolean>(false);
  readonly isActive            = signal<boolean>(false);
  readonly currentlyValueInput = signal<string>('');

  // ── Derived state ─────────────────────────────────────────────────────────

  /** True when there is at least one option to display. */
  readonly hasOptions   = computed(() => this.optionsValues().length > 0);

  /** True when the list is long enough to need a scroll area (> 4 options). */
  readonly isScrollable = computed(() => this.optionsValues().length > 4);

  // ── Unique coordinator ID ─────────────────────────────────────────────────

  private readonly id = `select-${Math.floor(Math.random() * 900_000 + 100_000)}${Date.now()}`;
  icon_Error: string = VAR_INPUT_FORM.ICON_ERROR;

  // ── Constructor: reactive side-effects ────────────────────────────────────

  constructor() {
    // ① React to `returnToDefault` input (replaces ngOnChanges)
    effect(() => {
      if (this.returnToDefault()) {
        this.currentlyValueInput.set(this.placeholder());
        this.isActive.set(false);
      }
    });

    // ② React to coordinator: close this dropdown when another opens
    const sub = this.coordinator.selectOpen$.subscribe((openId) => {
      if (openId !== this.id) {
        this.showDropdown.set(false);
      }
    });

    // ③ Unsubscribe automatically when component is destroyed
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  ngOnInit(): void {
    // Set placeholder as initial display value
    this.currentlyValueInput.set(this.placeholder() || 'Selecciona');

    // Pre-select if activeOption is a valid index
    const idx  = this.activeOption();
    const opts = this.optionsValues();
    if (idx >= 0 && idx < opts.length) {
      this.currentlyValueInput.set(opts[idx]);
      this.isActive.set(true);
    }
  }

  // ── User interactions ─────────────────────────────────────────────────────

  /**
   * Toggle the dropdown open / closed.
   * Ignored when the component is disabled or has no options.
   */
  handleDropdownVisibility(): void {
    if (this.isDisable() || !this.hasOptions()) return;

    const next = !this.showDropdown();
    this.showDropdown.set(next);

    if (next) {
      this.coordinator.openSelect(this.id);
    } else {
      this.coordinator.closeAllSelects();
    }
  }

  /**
   * Select an option from the list, emit events, and close the dropdown.
   */
  setInputOption(value: string, index: number): void {
    this.currentlyValueInput.set(value);
    this.isActive.set(true);
    this.showDropdown.set(false);
    this.handleInput.emit({ value, numberTab: index });
    this.onSelectOption.emit({ value, index });
    this.coordinator.closeAllSelects();
  }

  /** Close the dropdown without selecting a value. */
  closeSelect(): void {
    this.showDropdown.set(false);
    this.coordinator.closeAllSelects();
  }

  // ── Host listeners ────────────────────────────────────────────────────────

  /**
   * Stop propagation so the document:click handler below doesn't
   * immediately close the dropdown after it was just opened.
   */
  @HostListener('click', ['$event'])
  @HostListener('touchstart', ['$event'])
  onHostClick(event: Event): void {
    event.stopPropagation();
  }

  /** Close when focus leaves the component entirely. */
  @HostListener('focusout', ['$event'])
  onFocusOut(event: FocusEvent): void {
    const related = event.relatedTarget as HTMLElement | null;
    if (!related?.closest('.bocc-select')) {
      this.showDropdown.set(false);
      this.coordinator.closeAllSelects();
    }
  }

  /** Close when the user clicks anywhere outside this component. */
  @HostListener('document:click')
  onDocumentClick(): void {
    // stopPropagation in onHostClick prevents this from firing for
    // clicks inside the component, so we can safely close here.
    this.showDropdown.set(false);
    this.coordinator.closeAllSelects();
  }
}
