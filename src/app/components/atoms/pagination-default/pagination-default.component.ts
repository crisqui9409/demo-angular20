/**
 * Standard pagination component for navigating through data pages with ellipsis support.
 * @author Sebastian Barreto / Contact & Business IT
 * @version 1.0, 2026/04/14 – Migrated to Angular 20 standalone + signals
 *
 * @example
 * <bocc-pagination-default [currentPage]="1" [totalPages]="15" (pageChange)="onPageChange($event)"></bocc-pagination-default>
 */
import { Component, computed, input, output, signal, HostListener, ElementRef } from '@angular/core';
import { PageItem } from '../../../interfaces/PageItem';

@Component({
  selector: 'bocc-pagination-default',
  standalone: true,
  imports: [],
  templateUrl: './pagination-default.component.html',
  styleUrl: './pagination-default.component.scss',
})
export class PaginationDefaultComponent {
  public currentPage = input.required<number>();

  public totalPages = input.required<number>();

  public pageChange = output<number>();

  public isStartDropdownOpen = signal(false);
  public isEndDropdownOpen = signal(false);

  constructor(private elementRef: ElementRef) { }

  public pages = computed<PageItem[]>(() => {
    const current = this.currentPage();
    const total = this.totalPages();
    const items: PageItem[] = [];

    const range = (start: number, end: number) => {
      const res = [];
      for (let i = start; i <= end; i++) res.push(i);
      return res;
    };

    if (total <= 5) {
      for (let i = 1; i <= total; i++) items.push({ type: 'number', value: i });
    } else {
      if (current <= 2) {
        for (let i = 1; i <= 3; i++) items.push({ type: 'number', value: i });
        items.push({ type: 'ellipsis', hiddenPages: range(4, total - 1), isEnd: true });
        items.push({ type: 'number', value: total });
      } else if (current >= total - 1) {
        items.push({ type: 'number', value: 1 });
        items.push({ type: 'ellipsis', hiddenPages: range(2, total - 3), isEnd: false });
        for (let i = total - 2; i <= total; i++) items.push({ type: 'number', value: i });
      } else {
        items.push({ type: 'number', value: 1 });
        items.push({ type: 'ellipsis', hiddenPages: range(2, current - 1), isEnd: false });
        items.push({ type: 'number', value: current });
        items.push({ type: 'ellipsis', hiddenPages: range(current + 1, total - 1), isEnd: true });
        items.push({ type: 'number', value: total });
      }
    }

    return items;
  });

  public toggleDropdown(isEnd: boolean | undefined, event: Event): void {
    event.stopPropagation();
    if (isEnd) {
      this.isEndDropdownOpen.update(v => !v);
      this.isStartDropdownOpen.set(false);
    } else {
      this.isStartDropdownOpen.update(v => !v);
      this.isEndDropdownOpen.set(false);
    }
  }

  public onPageClick(page: number | string): void {
    if (typeof page === 'number' && page !== this.currentPage()) {
      this.pageChange.emit(page);
      this.isStartDropdownOpen.set(false);
      this.isEndDropdownOpen.set(false);
    }
  }

  public onPrevious(): void {
    if (this.currentPage() > 1) {
      this.pageChange.emit(this.currentPage() - 1);
    }
  }

  public onNext(): void {
    if (this.currentPage() < this.totalPages()) {
      this.pageChange.emit(this.currentPage() + 1);
    }
  }

  @HostListener('document:click', ['$event'])
  public onClickOutside(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isStartDropdownOpen.set(false);
      this.isEndDropdownOpen.set(false);
    }
  }
}
