/**
 * SpinnerComponent – Angular 20 Standalone
 * ─────────────────────────────────────────────────────────────────
 * Reusable spinner/loading atom.
 * Provides both fullscreen overlay and inline loading modes.
 * Uses a radial segmented animation for visual feedback.
 * ─────────────────────────────────────────────────────────────────
 * @author Carlos Nuncira / Contact & Business IT
 * @version 1.0.3, 2026/04/17 – Migrated to Angular 20 standalone + signals
 */
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Supported spinner sizes. */
type SpinnerSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'bocc-spinner',
  standalone: true,
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {
  // ── Inputs ───────────────────────────────────────────────────────────────

  /** Controls whether the spinner is visible. */
  readonly visible = input<boolean>(true);

  /**
   * When true, renders the spinner as a fullscreen overlay.
   * When false, behaves as an inline loader inside its container.
   */
  readonly fullScreen = input<boolean>(true);

  /** Visual size of the spinner. */
  readonly size = input<SpinnerSize>('md');

  /** Accessible label for screen readers. */
  readonly ariaLabel = input<string>('Cargando contenido');

  // ── Derived state ────────────────────────────────────────────────────────

  /**
   * Resolves the container class.
   * Adds fullscreen modifier when required.
   */
  readonly containerClass = computed(() => {
    return this.fullScreen() ? 'spinner spinner--fullscreen' : 'spinner';
  });

  /**
   * Resolves the indicator class based on selected size.
   */
  readonly indicatorClass = computed(() => {
    return `spinner__indicator spinner__indicator--${this.size()}`;
  });
}