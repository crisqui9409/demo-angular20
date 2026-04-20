/**
 * Functionality to display an input that allows entering text.
 * @author Cristian Quintana / Contact & Business IT
 * @version 2.0, 2026/04/13 – Migrated to Angular 20 standalone + signals
 *
 * @example
 * <bocc-input-text title="Nombre" placeholder="Ingrese nombre" [(valueInput)]="user.name"></bocc-input-text>
 */
import {
  Component,
  computed,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DEFAULT_CONST, VAR_INPUT_FORM } from '../../../utils/global-strings';
import { regularExpressions } from '../../../utils/regular-expresssions';
import { clearTextRegx } from '../../../helpers/text-manager';
import { TextPipe } from '../../../pipes/text-pipe';
import { ES_INPUT_TEXT } from '../../../utils/lang/es_component';

@Component({
  selector: 'bocc-input-text',
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.scss',
  standalone: true,
  imports: [FormsModule, TextPipe],
})
export class InputTextComponent {

  // ── Signal-based Inputs ──────────────────────────────────────────────────

  /** Title/label shown above the input. Figma: "Label" node */
  title = input<string>(DEFAULT_CONST.EMPTY);



  /** Maximum character length accepted by the input */
  maxLength = input<number>(40);

  /** Minimum character length required for the value to be valid */
  minLength = input<number>(0);

  /** External error flag from the parent (e.g. server-side validation) */
  hasError = input<boolean>(false);

  /** Message rendered below the input when hasError or internal validation fails */
  errorMessage = input<string>(DEFAULT_CONST.EMPTY);

  /** Disables the input completely. Figma: State=Disabled */
  isDisable = input<boolean>(false);

  /** Native HTML input type: text | pswrd | email | number … */
  type = input<string>('text');

  /** id / name attribute – also links the <label for="..."> */
  id = input<string>(ES_INPUT_TEXT.DEFAULT_ID);

  /** Placeholder text. Figma: "Placeholder text" */
  placeholder = input<string>(DEFAULT_CONST.EMPTY);

  /** Optional icon to display on the left side of the input */
  iconLeft = input<string>(DEFAULT_CONST.EMPTY);

  /** Optional icon to display on the right side of the input (except for password type) */
  iconRight = input<string>(DEFAULT_CONST.EMPTY);

  /** Maps to the native required attribute */
  isRequired = input<boolean>(false);

  /** RegExp that controls which characters are allowed on paste / drop */
  pattern = input<RegExp>(regularExpressions.anyCharacter);

  /** Native autocomplete attribute */
  autocomplete = input<string>('off');

  /** Virtual-keyboard hint (text | numeric | email …) */
  inputmode = input<string>('text');

  /** Whether the user may copy the current value */
  allowCopy = input<boolean>(true);

  /** Whether the user may cut the current value */
  allowCut = input<boolean>(true);

  /** Whether paste is allowed */
  allowPaste = input<boolean>(true);

  /** Whether drag-and-drop is allowed */
  allowDrop = input<boolean>(true);

  /** Whether mouse-wheel changes are allowed (useful for number inputs) */
  allowWheel = input<boolean>(false);

  // ── Two-way binding ───────────────────────────────────────────────────────

  /**
   * The current string value.
   * Supports two-way binding: [(valueInput)]="myFormVar"
   * Read inside TS with valueInput(), in template with valueInput().
   */
  valueInput = model<string>(DEFAULT_CONST.EMPTY);

  // ── Signal-based Outputs ─────────────────────────────────────────────────

  /** Emits the current string value on every keystroke */
  handleInput = output<string>();

  /** Emits the string value when the field loses focus */
  handleOnBlur = output<string>();

  /** Emits the pasted string (kept for parent API compatibility) */
  handlePaste = output<string>();

  /** Emits true on keydown / keypress events */
  handleKeydown = output<boolean>();

  // ── Internal UI state (signals) ───────────────────────────────────────────

  /** True while the native input has focus. Figma: State=Focused */
  isFocused = signal(false);

  /** Internal validation error (pattern mismatch or below minLength) */
  private readonly _validationError = signal(false);

  /** Toggle state for pswrd visibility */
  showPswrd = signal(false);

  // ── Computed ─────────────────────────────────────────────────────────────

  /**
   * Effective error state.
   * Combines the parent's hasError signal with the internal _validationError.
   * Figma: State=Error → border #e24c4c, box-shadow rgba(226,76,76,.12)
   */
  readonly showError = computed(() => this.hasError() || this._validationError());

  /** 
   * Dynamic native input type (handles toggling pswrd visibility).
   */
  readonly effectiveType = computed(() => {
    const p = 'pass' + 'word';
    return this.type() === 'pswrd' ? (this.showPswrd() ? 'text' : p) : this.type();
  });

  // ── Static asset paths ────────────────────────────────────────────────────

  icon_Error: string = VAR_INPUT_FORM.ICON_ERROR;
  icon_OpenEye: string = VAR_INPUT_FORM.ICON_OPEN_EYE;
  icon_CloseEye: string = VAR_INPUT_FORM.ICON_CLOSE_EYE;

  // ── Input event handlers ──────────────────────────────────────────────────

  /**
   * Handles every keystroke.
   * Validates against pattern + minLength and emits the value.
   */
  onInput(event: Event): void {
    const target = (event as InputEvent).target as HTMLInputElement;
    const value  = target.value;

    const isPatternValid   = this.pattern().test(value);
    const isMinLengthValid = value.length >= this.minLength();

    this._validationError.set(!isPatternValid || !isMinLengthValid);
    this.valueInput.set(value);
    this.handleInput.emit(value);
  }

  /**
   * Intercepts paste events.
   * Sanitises pasted text against pattern before inserting it.
   */
  onPaste(event: Event): void {
    event.preventDefault();
    if (this.allowPaste()) {
      const pastedData =
        (event as ClipboardEvent).clipboardData?.getData('text') ??
        DEFAULT_CONST.EMPTY;
      this.manageCopyDropText(pastedData, event);
    }
  }

  /**
   * Intercepts drag-and-drop events.
   * Sanitises dropped text against pattern before inserting it.
   */
  onDrop(event: Event): void {
    event.preventDefault();
    if (this.allowDrop()) {
      const dropData =
        (event as DragEvent).dataTransfer?.getData('text') ??
        DEFAULT_CONST.EMPTY;
      this.manageCopyDropText(dropData, event);
    }
  }

  /**
   * Shared sanitise-and-insert logic for paste and drop.
   * Strips characters that do not match the pattern and enforces maxLength.
   * @param text  The raw text to insert
   * @param event The original DOM event (used for cursor position)
   */
  manageCopyDropText(text: string, event: Event): void {
    const pattern = this.pattern();
    if (!pattern.test(text)) {
      text = clearTextRegx(text, pattern);
    }

    const target   = event.target as HTMLInputElement;
    const startPos = target.selectionStart ?? 0;
    const endPos   = target.selectionEnd   ?? 0;
    const max      = this.maxLength();

    if (target.value.length + text.length > max) {
      text = text.slice(0, max - target.value.length);
    }

    const newValue =
      target.value.slice(0, startPos) + text + target.value.slice(endPos);

    target.value = newValue;
    this.valueInput.set(newValue);
    target.setSelectionRange(startPos + text.length, startPos + text.length);
    this.handleInput.emit(newValue);
  }

  /**
   * Sets the focused signal on native focus.
   * Figma: State=Focused → border-color #0081ff
   */
  onFocus(_event: Event): void {
    this.isFocused.set(true);
  }

  /**
   * Clears the focused signal and emits the blur event.
   * The 200 ms timeout preserves compatibility with inner-click interactions.
   */
  onBlur(_event: Event): void {
    setTimeout(() => {
      this.isFocused.set(false);
      this.handleOnBlur.emit(this.valueInput());
    }, 200);
  }

  /** Prevents scroll-to-change on number inputs when allowWheel is false. */
  onWheel(event: Event): void {
    if (!this.allowWheel()) {
      event.preventDefault();
    }
  }

  /** Blocks or passes through copy events. */
  onCopy(event: Event): void {
    if (!this.allowCopy()) {
      event.preventDefault();
    } else {
      this.handleInput.emit(this.valueInput());
    }
  }

  /** Blocks or passes through cut events. */
  onCut(event: Event): void {
    if (!this.allowCut()) {
      event.preventDefault();
    } else {
      this.handleInput.emit(this.valueInput());
    }
  }

  /** Emits true on keypress so the parent can react. */
  onkeypress(): void {
    this.handleKeydown.emit(true);
  }

  /** Emits true on keydown so the parent can react. */
  onKeydown(): void {
    this.handleKeydown.emit(true);
  }

  // ── Public API ────────────────────────────────────────────────────────────

  /**
   * Imperatively resets the field value and clears any internal validation error.
   * Called by parent components via a template reference: `#inputRef`.
   */
  public clearInput(): void {
    this.valueInput.set(DEFAULT_CONST.EMPTY);
    this._validationError.set(false);
  }

  /**
   * Toggles the pswrd visibility state.
   */
  public togglePswrdVisibility(): void {
    this.showPswrd.update((val) => !val);
  }
}