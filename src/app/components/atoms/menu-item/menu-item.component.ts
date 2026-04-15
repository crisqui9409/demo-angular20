import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DEFAULT_CONST } from '../../../utils/global-strings';

@Component({
  selector: 'ui-menu-item',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiMenuItemComponent {
  @Input() label: string = DEFAULT_CONST.EMPTY;
  @Input() subtitle: string = DEFAULT_CONST.EMPTY;

  @Input() startIconPath: string = DEFAULT_CONST.EMPTY;
  @Input() endIconPath: string = DEFAULT_CONST.EMPTY;

  @Input() href: string = DEFAULT_CONST.EMPTY;
  @Input() target: '_self' | '_blank' | '_parent' | '_top' = '_self';
  @Input() rel: string = 'noopener noreferrer';

  @Input() routerLink: string | readonly string[] = DEFAULT_CONST.EMPTY;

  @Input() disabled = false;
  @Input() active = false;
  @Input() selected = false;

  @Input() badgeText: string = DEFAULT_CONST.EMPTY;
  @Input() badgeVariant: 'high' | 'medium' | 'low' = 'medium';

  @Output() readonly itemClick = new EventEmitter<void>();

  get containerClass(): string {
    const classes = ['menu-item'];

    if (this.active) {
      classes.push('menu-item--active');
    }

    if (this.selected) {
      classes.push('menu-item--selected');
    }

    if (this.disabled) {
      classes.push('menu-item--disabled');
    }

    return classes.join(' ');
  }

  get badgeClass(): string {
    return `menu-item__badge menu-item__badge--${this.badgeVariant}`;
  }

  get hasSubtitle(): boolean {
    return this.subtitle.trim().length > 0;
  }

  get hasStartIcon(): boolean {
    return this.startIconPath.trim().length > 0;
  }

  get hasEndIcon(): boolean {
    return this.endIconPath.trim().length > 0;
  }

  get hasBadge(): boolean {
    return this.badgeText.trim().length > 0;
  }

  get hasHref(): boolean {
    return this.href.trim().length > 0;
  }

  get hasRouterLink(): boolean {
    if (Array.isArray(this.routerLink)) {
      return this.routerLink.length > 0;
    }

    return String(this.routerLink).trim().length > 0;
  }

  onClick(): void {
    if (this.disabled) {
      return;
    }

    this.itemClick.emit();
  }
}