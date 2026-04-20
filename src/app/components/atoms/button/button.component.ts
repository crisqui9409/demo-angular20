/**
 * ButtonComponent – Angular 20 Standalone
 * ─────────────────────────────────────────────────────────────────
 * Reusable button atom.
 * Supports primary and secondary variants, optional icon rendering,
 * disabled state handling, and hover-based icon replacement.
 * ─────────────────────────────────────────────────────────────────
 * @author Carlos Nuncira / Contact & Business IT
 * @version 1.0.3, 2026/04/17 – Migrated to Angular 20 standalone + signals
 */
import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { DEFAULT_CONST } from '../../../utils/global-strings';
import { ButtonResolvedClass, ButtonVariant } from '../../../types/component_type';

@Component({
  selector: 'bocc-button',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  // ── Internal state ───────────────────────────────────────────────────────

  /** Tracks whether the button is currently hovered. */
  private readonly isHovered = signal(false);

  // ── Inputs ───────────────────────────────────────────────────────────────

  /** Visual variant of the button. */
  readonly variant = input<ButtonVariant>('btn-primary');

  /** Text displayed inside the button. */
  readonly label = input<string>(DEFAULT_CONST.EMPTY);

  /** Disables user interaction when true. */
  readonly disabled = input<boolean>(false);

  /** Controls whether the icon element should be rendered. */
  readonly showIcon = input<boolean>(false);

  /** Enables icon replacement while the button is hovered. */
  readonly enableHoverIcon = input<boolean>(false);

  /** Default icon path shown in the normal state. */
  readonly iconDefault = input<string>(DEFAULT_CONST.EMPTY);

  /** Icon path shown while hovered when hover icon support is enabled. */
  readonly iconOnHover = input<string>(DEFAULT_CONST.EMPTY);

  /** Icon path shown when the button is disabled. */
  readonly iconOnDisabled = input<string>(DEFAULT_CONST.EMPTY);

  // ── Outputs ──────────────────────────────────────────────────────────────

  /** Emits when the button is clicked and the component is not disabled. */
  readonly buttonClick = output<void>();

  // ── Derived state ────────────────────────────────────────────────────────

  /**
   * Resolves the CSS class applied to the root button element.
   * Returns the disabled variant when the button is not interactive.
   */
  readonly resolvedClass = computed<ButtonResolvedClass>(() => {
    if (!this.disabled()) {
      return this.variant();
    }

    return this.variant() === 'btn-primary' ? 'btn-inactive-primary' : 'btn-inactive';
  });

  /**
   * Resolves the icon path for the current visual state.
   * Priority:
   * 1. Disabled icon
   * 2. Hover icon
   * 3. Default icon
   */
  readonly resolvedIcon = computed<string>(() => {
    if (this.disabled()) {
      return this.iconOnDisabled() || this.iconDefault();
    }

    if (this.enableHoverIcon() && this.isHovered() && this.iconOnHover()) {
      return this.iconOnHover();
    }

    return this.iconDefault();
  });

  /** True when the label contains visible text. */
  readonly hasLabel = computed<boolean>(() => this.label().trim().length > 0);

  /**
   * Returns the CSS-compatible background-image value for the icon element.
   * Falls back to `none` when no icon is available.
   */
  readonly iconBackgroundImage = computed<string>(() => {
    return this.resolvedIcon() ? `url(${this.resolvedIcon()})` : 'none';
  });

  // ── User interactions ────────────────────────────────────────────────────

  /**
   * Emits the click event when the button is enabled.
   * Disabled buttons do not emit output events.
   */
  onClick(): void {
    if (this.disabled()) {
      return;
    }

    this.buttonClick.emit();
  }

  /**
   * Activates the hover state when hover icon support is enabled.
   */
  onMouseEnter(): void {
    if (this.enableHoverIcon()) {
      this.isHovered.set(true);
    }
  }

  /**
   * Clears the hover state when hover icon support is enabled.
   */
  onMouseLeave(): void {
    if (this.enableHoverIcon()) {
      this.isHovered.set(false);
    }
  }
}
