/**
 * InputSelectComponent – Angular 20 Standalone
 * ─────────────────────────────────────────────────────────────────
 * Fully reactive dropdown select atom built with Angular Signals.
 * Handles single-option selection with multiple visual states (default, hover, 
 * error, and disabled). Features a custom scrollable list and integrates with 
 * a centralized Coordinator Service to manage simultaneous open dropdowns. 
 * 
 * @author  : Cristian Quintana / Contact & Business IT
 * @version : 1.2 – 2026/04/15 
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
import { TextPipe } from '../../../pipes/text-pipe';

@Component({
  selector: 'bocc-input-select',
  standalone: true,
  imports: [TextPipe],
  templateUrl: './input-select.component.html',
  styleUrl: './input-select.component.scss',
})
export class InputSelectComponent implements OnInit {

  
  /** Service to coordinate multiple select components, ensuring only one stays open at a time. */
  private readonly coordinator = inject(SelectCoordinatorService);
  /** Service to manage unsubscriptions when the component is destroyed. */
  private readonly destroyRef  = inject(DestroyRef);


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

  /** Path or URL for the trailing chevron icon. */
  readonly iconChevron = input<string>(VAR_INPUT_FORM.ICON_CHEVRON_DOWN);


  /** Emits the value and its index whenever an option is chosen. */
  readonly handleInput   = output<{ value: string; numberTab: number }>();
  /** Same event with a more descriptive name, emits selected value and its index. */
  readonly onSelectOption = output<{ value: string; index: number }>();


  /** Internal state that controls the visibility of the options dropdown panel. */
  readonly showDropdown        = signal<boolean>(false);
  /** Internal state that marks the input as active (i.e. an option is selected). */
  readonly isActive            = signal<boolean>(false);
  /** Holds the current text displayed inside the select input box. */
  readonly currentlyValueInput = signal<string>('');


  /** True when there is at least one option to display. */
  readonly hasOptions   = computed(() => this.optionsValues().length > 0);

  /** True when the list is long enough to need a scroll area (> 4 options). */
  readonly isScrollable = computed(() => this.optionsValues().length > 4);


  /** Unique identifier automatically generated to manage collisions in the Coordinator service. */
  private readonly id = `select-${Math.floor(Math.random() * 900_000 + 100_000)}${Date.now()}`;
  /** Path to the error icon, loaded from global dictionary. */
  icon_Error: string = VAR_INPUT_FORM.ICON_ERROR;

  /**
   * Constructor: reactive side-effects
   */
  constructor() {

    effect(() => {
      if (this.returnToDefault()) {
        this.currentlyValueInput.set(this.placeholder());
        this.isActive.set(false);
      }
    });

    //React to coordinator: close this dropdown when another opens
    const sub = this.coordinator.selectOpen$.subscribe((openId) => {
      if (openId !== this.id) {
        this.showDropdown.set(false);
      }
    });

    //  Unsubscribe automatically when component is destroyed
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  /** 
   * Lifecycle hook: initialization 
  */
  ngOnInit(): void {
    this.currentlyValueInput.set(this.placeholder() || 'Selecciona');
    const idx  = this.activeOption();
    const opts = this.optionsValues();
    if (idx >= 0 && idx < opts.length) {
      this.currentlyValueInput.set(opts[idx]);
      this.isActive.set(true);
    }
  }

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
    this.showDropdown.set(false);
    this.coordinator.closeAllSelects();
  }
}
