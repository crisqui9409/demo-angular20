/**
 * UiMenuItemComponent – Angular 20 Standalone
 * ─────────────────────────────────────────────────────────────────
 * Reusable navigation item.
 * Supports external links, router navigation, and button interaction.
 * Includes optional icons, subtitle, and badge.
 * ─────────────────────────────────────────────────────────────────
 * @author Carlos Nuncira / Contact & Business IT
 * @version 1.0.3, 2026/04/17 – Migrated to Angular 20 standalone + signals
 */
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DEFAULT_CONST } from '../../../utils/global-strings';

@Component({
  selector: 'bocc-menu-item',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuItemComponent {

  // ── Inputs: content ─────────────────────────────────────────────

  readonly label = input<string>(DEFAULT_CONST.EMPTY);
  readonly subtitle = input<string>(DEFAULT_CONST.EMPTY);

  // ── Inputs: icons ───────────────────────────────────────────────

  readonly startIconPath = input<string>(DEFAULT_CONST.EMPTY);
  readonly endIconPath = input<string>(DEFAULT_CONST.EMPTY);

  // ── Inputs: navigation ──────────────────────────────────────────

  readonly href = input<string>(DEFAULT_CONST.EMPTY);
  readonly target = input<'_self' | '_blank' | '_parent' | '_top'>('_self');
  readonly rel = input<string>('noopener noreferrer');
  readonly routerLink = input<string | readonly string[]>(DEFAULT_CONST.EMPTY);

  // ── Inputs: state ───────────────────────────────────────────────

  readonly disabled = input<boolean>(false);
  readonly active = input<boolean>(false);
  readonly selected = input<boolean>(false);

  // ── Inputs: badge ───────────────────────────────────────────────

  readonly badgeText = input<string>(DEFAULT_CONST.EMPTY);
  readonly badgeVariant = input<'high' | 'medium' | 'low'>('medium');

  // ── Outputs ─────────────────────────────────────────────────────

  readonly itemClick = output<void>();

  // ── Derived state ───────────────────────────────────────────────

  readonly containerClass = computed(() => {
    const classes = ['menu-item'];

    if (this.active()) classes.push('menu-item--active');
    if (this.selected()) classes.push('menu-item--selected');
    if (this.disabled()) classes.push('menu-item--disabled');

    return classes.join(' ');
  });

  readonly badgeClass = computed(() =>
    `menu-item__badge menu-item__badge--${this.badgeVariant()}`
  );

  // ── Conditional helpers ─────────────────────────────────────────

  readonly hasSubtitle = computed(() => this.subtitle().trim().length > 0);
  readonly hasStartIcon = computed(() => this.startIconPath().trim().length > 0);
  readonly hasEndIcon = computed(() => this.endIconPath().trim().length > 0);
  readonly hasBadge = computed(() => this.badgeText().trim().length > 0);
  readonly hasHref = computed(() => this.href().trim().length > 0);

  readonly hasRouterLink = computed(() => {
    const value = this.routerLink();

    if (Array.isArray(value)) {
      return value.length > 0;
    }

    return String(value).trim().length > 0;
  });

  // ── User interaction ────────────────────────────────────────────

  onClick(): void {
    if (this.disabled()) {
      return;
    }

    this.itemClick.emit();
  }
}