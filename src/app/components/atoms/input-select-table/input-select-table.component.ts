/**
 * Custom dropdown selector used in tables to control the number of records shown per page.
 * @author Sebastian Barreto / Contact & Business IT
 * @version 1.0, 2026/04/14 – Migrated to Angular 20 standalone + signals
 *
 * @example
 * <bocc-input-select-table [selectedSize]="10" (sizeChange)="onSizeChange($event)"></bocc-input-select-table>
 */
import { Component, input, output, signal, HostListener, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'bocc-input-select-table',
  imports: [],
  templateUrl: './input-select-table.component.html',
  styleUrl: './input-select-table.component.scss',
})
export class InputSelectTableComponent implements OnInit {
  public options = input<number[]>([10, 20, 50]);

  public selectedSize = input<number>(10);

  public sizeChange = output<number>();

  public isOpen = signal(false);

  public currentValue = signal<number>(10);

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {
    this.currentValue.set(this.selectedSize());
  }

  public toggleDropdown(): void {
    this.isOpen.update((value) => !value);
  }

  public selectOption(option: number): void {
    this.currentValue.set(option);
    this.sizeChange.emit(option);
    this.isOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  public onClickOutside(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
}
