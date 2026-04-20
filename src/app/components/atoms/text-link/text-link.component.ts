/**
 * TextLinkComponent – Angular 20 Standalone
 * ─────────────────────────────────────────────────────────────────
 * Reusable text link atom.
 * Supports external links, internal routing, and button fallback.
 * Includes visual variants and disabled state handling.
 * ─────────────────────────────────────────────────────────────────
 * @author Carlos Nuncira / Contact & Business IT
 * @version 1.0.3, 2026/04/17 – Migrated to Angular 20 standalone + signals
 */
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DEFAULT_CONST } from '../../../utils/global-strings';

/** Supported visual variants for the text link. */
type TextLinkVariant = 'danger' | 'primary' | 'neutral';

@Component({
  selector: 'bocc-text-link',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './text-link.component.html',
  styleUrls: ['./text-link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextLinkComponent {
  // ── Inputs: content ──────────────────────────────────────────────────────

  /** Text displayed inside the link. */
  readonly label = input<string>(DEFAULT_CONST.EMPTY);

  // ── Inputs: navigation ───────────────────────────────────────────────────

  /** External navigation URL. */
  readonly href = input<string>(DEFAULT_CONST.EMPTY);

  /** Target attribute for external links. */
  readonly target = input<'_self' | '_blank' | '_parent' | '_top'>('_self');

  /** Rel attribute for external links. */
  readonly rel = input<string>('noopener noreferrer');

  /** Internal navigation using Angular router. */
  readonly routerLink = input<string | readonly string[]>(DEFAULT_CONST.EMPTY);

  // ── Inputs: state ────────────────────────────────────────────────────────

  /** Visual variant controlling text color. */
  readonly variant = input<TextLinkVariant>('primary');

  /** Disables interaction when true. */
  readonly disabled = input<boolean>(false);

  // ── Outputs ──────────────────────────────────────────────────────────────

  /** Emits when the link is clicked. */
  readonly linkClick = output<void>();

  // ── Derived state ────────────────────────────────────────────────────────

  /**
   * Resolves the CSS class applied to the element.
   * Combines base class, variant, and disabled modifier.
   */
  readonly linkClass = computed(() => {
    const classes = ['text-link', `text-link--${this.variant()}`];

    if (this.disabled()) {
      classes.push('text-link--disabled');
    }

    return classes.join(' ');
  });

  // ── Conditional helpers ──────────────────────────────────────────────────

  /** True when external link is defined. */
  readonly hasHref = computed(() => this.href().trim().length > 0);

  /** True when routerLink is defined. */
  readonly hasRouterLink = computed(() => {
    const value = this.routerLink();

    if (Array.isArray(value)) {
      return value.length > 0;
    }

    return String(value).trim().length > 0;
  });

  // ── User interaction ─────────────────────────────────────────────────────

  /**
   * Emits click event when not disabled.
   */
  onClick(): void {
    if (this.disabled()) {
      return;
    }

    this.linkClick.emit();
  }
}
