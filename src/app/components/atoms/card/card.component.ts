/**
 * UiCardComponent – Angular 20 Standalone
 * ─────────────────────────────────────────────────────────────────
 * Reusable card/container atom.
 * Provides configurable padding, border radius, and height behavior.
 * Designed to wrap arbitrary content using content projection.
 * ─────────────────────────────────────────────────────────────────
 * @author Carlos Nuncira / Contact & Business IT
 * @version 1.0.3, 2026/04/17 – Migrated to Angular 20 standalone + signals
 */
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Supported padding sizes. */
type CardPadding = 'none' | 'sm' | 'md' | 'lg';

/** Supported border radius sizes. */
type CardRadius = 'sm' | 'md' | 'lg';

@Component({
  selector: 'bocc-card',
  standalone: true,
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  // ── Inputs ───────────────────────────────────────────────────────────────

  /** Controls internal spacing of the card. */
  readonly padding = input<CardPadding>('md');

  /** Controls border radius of the card. */
  readonly radius = input<CardRadius>('md');

  /** Enables full height behavior. */
  readonly fullHeight = input<boolean>(false);

  // ── Derived state ────────────────────────────────────────────────────────

  readonly cardClass = computed(() => {
    const classes = ['card', `card--padding-${this.padding()}`, `card--radius-${this.radius()}`];

    if (this.fullHeight()) {
      classes.push('card--full-height');
    }

    return classes.join(' ');
  });
}
