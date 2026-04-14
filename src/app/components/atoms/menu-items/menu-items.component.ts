import { Component, input, output } from '@angular/core';

export interface MenuItem {
  id: string | number;
  label: string;
  icon?: string;
  disabled?: boolean;
}

@Component({
  selector: 'bocc-menu-items',
  standalone: true,
  imports: [],
  templateUrl: './menu-items.component.html',
  styleUrl: './menu-items.component.scss',
})
export class MenuItemsComponent {
  /** List of menu items to display */
  public items = input.required<MenuItem[]>();

  /** ID of the currently selected item */
  public selectedId = input<string | number>();

  /** Whether the menu is expanded (showing labels) or collapsed (icons only) */
  public isExpanded = input<boolean>(true);

  /** Event emitted when an item is clicked */
  public itemClick = output<MenuItem>();

  /** Handles the item click */
  public onItemClick(item: MenuItem): void {
    if (item.disabled) return;
    this.itemClick.emit(item);
  }
}
