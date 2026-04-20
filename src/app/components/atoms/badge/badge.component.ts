/**
 * UiBadgeComponent – Angular 20 Standalone
 * ─────────────────────────────────────────────────────────────────
 * Reusable badge atom.
 * Used to display short status labels with semantic color variants.
 * ─────────────────────────────────────────────────────────────────
 * @author Carlos Nuncira / Contact & Business IT
 * @version 1.0.3, 2026/04/17 – Migrated to Angular 20 standalone + signals
 */
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DEFAULT_CONST } from '../../../utils/global-strings';

/** Supported badge variants representing semantic states. */
type BadgeVariant = 'high' | 'medium' | 'low';

@Component({
  selector: 'bocc-badge',
  standalone: true,
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeComponent {

  // ── Inputs ───────────────────────────────────────────────────────────────

  /** Text displayed inside the badge. */
  readonly label = input<string>(DEFAULT_CONST.EMPTY);

  /** Visual variant controlling background and text color. */
  readonly variant = input<BadgeVariant>('medium');

  // ── Derived state ────────────────────────────────────────────────────────

  /**
   * Resolves the CSS class applied to the badge element.
   * Combines base class with variant modifier.
   */
  readonly badgeClass = computed(() => `badge badge--${this.variant()}`);
}