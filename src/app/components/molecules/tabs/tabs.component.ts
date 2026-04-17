/**
 * Navigation component to toggle between different content views or categories.
 * @author Sebastian Barreto / Contact & Business IT
 * @version 1.0, 2026/04/14 – Migrated to Angular 20 standalone + signals
 *
 * @example
 * <bocc-tabs [tabs]="tabItems" [activeTabId]="'tab1'" (tabChange)="onTabChange($event)"></bocc-tabs>
 */
import { Component, input, output } from '@angular/core';
import { TabItem } from '../../../interfaces/TabItem';

import { MasterIconComponent } from '../../atoms/master-icon/master-icon.component';

@Component({
  selector: 'bocc-tabs',
  standalone: true,
  imports: [MasterIconComponent],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
})
export class TabsComponent {
  public tabs = input.required<TabItem[]>();

  public activeTabId = input.required<string | number>();

  public tabChange = output<string | number>();

  public onTabClick(id: string | number): void {
    if (id !== this.activeTabId()) {
      this.tabChange.emit(id);
    }
  }
}
