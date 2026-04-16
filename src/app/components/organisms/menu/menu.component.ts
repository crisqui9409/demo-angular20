/**
 * Navigation component that displays a list of menu options with support for icons and collapsed (hamburger) state.
 * @author Sebastian Barreto / Contact & Business IT
 * @version 1.0, 2026/04/14 – Migrated to Angular 20 standalone + signals
 *
 * @example
 * <bocc-menu [items]="menuItems" [isExpanded]="true" (itemClick)="onItemClick($event)"></bocc-menu>
 */
import { Component, input, output } from '@angular/core';

export interface MenuItem {
  id: string | number;
  label: string;
  icon?: string;
  disabled?: boolean;
}

@Component({
  selector: 'bocc-menu',
  standalone: true,
  imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  public items = input.required<MenuItem[]>();

  public selectedId = input<string | number>();

  public isExpanded = input<boolean>(true);

  public itemClick = output<MenuItem>();

  public onItemClick(item: MenuItem): void {
    if (item.disabled) return;
    this.itemClick.emit(item);
  }
}
