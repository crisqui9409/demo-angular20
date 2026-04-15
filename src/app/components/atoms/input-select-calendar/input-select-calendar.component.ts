import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { DEFAULT_CONST } from '../../../utils/global-strings';

type CalendarSelectionMode = 'single' | 'range';

interface CalendarDay {
  date: Date;
  dayNumber: number;
  monthOffset: -1 | 0 | 1;
  disabled: boolean;
  isToday: boolean;
  isSelected: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isInRange: boolean;
}

interface CalendarValue {
  startDate: Date | null;
  endDate: Date | null;
}

@Component({
  selector: 'ui-input-select-calendar',
  standalone: true,
  templateUrl: './input-select-calendar.component.html',
  styleUrls: ['./input-select-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiInputSelectCalendarComponent {
  @ViewChild('calendarWrapper') calendarWrapper?: ElementRef<HTMLDivElement>;

  @Input() label: string = 'Fecha';
  @Input() placeholder: string = 'DD/MM/AAAA';
  @Input() mode: CalendarSelectionMode = 'single';
  @Input() disabled = false;
  @Input() minDate: Date | null = null;

  @Output() readonly valueChange = new EventEmitter<Date | CalendarValue | null>();

  readonly weekDays: string[] = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
  readonly monthNames: string[] = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  isOpen = false;

  currentMonth = new Date().getMonth();
  currentYear = new Date().getFullYear();

  selectedStartDate: Date | null = null;
  selectedEndDate: Date | null = null;
  hoverDate: Date | null = null;

  get years(): number[] {
    const currentYear = new Date().getFullYear();
    const baseYear = this.minDate ? this.minDate.getFullYear() : currentYear - 5;

    return Array.from({ length: 11 }, (_, index) => baseYear + index);
  }

  get days(): CalendarDay[] {
    return this.buildCalendarDays(this.currentYear, this.currentMonth);
  }

  get displayValue(): string {
    if (this.mode === 'single') {
      return this.selectedStartDate ? this.formatDate(this.selectedStartDate) : DEFAULT_CONST.EMPTY;
    }

    if (this.selectedStartDate && this.selectedEndDate) {
      return `${this.formatDate(this.selectedStartDate)} - ${this.formatDate(this.selectedEndDate)}`;
    }

    if (this.selectedStartDate) {
      return `${this.formatDate(this.selectedStartDate)} -`;
    }

    return DEFAULT_CONST.EMPTY;
  }

  toggleCalendar(): void {
    if (this.disabled) {
      return;
    }

    this.isOpen = !this.isOpen;
  }

  closeCalendar(): void {
    this.isOpen = false;
    this.hoverDate = null;
  }

  onMonthChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.currentMonth = Number(target.value);
  }

  onYearChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.currentYear = Number(target.value);
  }

  onPreviousMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear -= 1;
      return;
    }

    this.currentMonth -= 1;
  }

  onNextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear += 1;
      return;
    }

    this.currentMonth += 1;
  }

  onDayHover(day: CalendarDay): void {
    if (this.mode !== 'range' || day.disabled || !this.selectedStartDate || this.selectedEndDate) {
      return;
    }

    this.hoverDate = day.date;
  }

  onDayLeave(): void {
    this.hoverDate = null;
  }

  onDaySelect(day: CalendarDay): void {
    if (day.disabled) {
      return;
    }

    if (this.mode === 'single') {
      this.selectedStartDate = this.cloneDate(day.date);
      this.selectedEndDate = null;
      this.emitValue();
      this.closeCalendar();
      return;
    }

    if (!this.selectedStartDate || (this.selectedStartDate && this.selectedEndDate)) {
      this.selectedStartDate = this.cloneDate(day.date);
      this.selectedEndDate = null;
      this.hoverDate = null;
      this.emitValue();
      return;
    }

    if (this.isBefore(day.date, this.selectedStartDate)) {
      this.selectedEndDate = this.cloneDate(this.selectedStartDate);
      this.selectedStartDate = this.cloneDate(day.date);
      this.emitValue();
      return;
    }

    this.selectedEndDate = this.cloneDate(day.date);
    this.emitValue();
    this.closeCalendar();
  }

  clearSelection(): void {
    this.selectedStartDate = null;
    this.selectedEndDate = null;
    this.hoverDate = null;
    this.emitValue();
  }

  trackByDay(_: number, day: CalendarDay): string {
    return day.date.toISOString();
  }

  getDayButtonClass(day: CalendarDay): string {
    const classes = ['calendar__day'];

    if (day.monthOffset !== 0) {
      classes.push('calendar__day--outside');
    }

    if (day.disabled) {
      classes.push('calendar__day--disabled');
    }

    if (day.isToday) {
      classes.push('calendar__day--today');
    }

    if (day.isInRange) {
      classes.push('calendar__day--in-range');
    }

    if (day.isSelected) {
      classes.push('calendar__day--selected');
    }

    if (day.isRangeStart) {
      classes.push('calendar__day--range-start');
    }

    if (day.isRangeEnd) {
      classes.push('calendar__day--range-end');
    }

    return classes.join(' ');
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isOpen || !this.calendarWrapper) {
      return;
    }

    const targetNode = event.target as Node;
    const clickedInside = this.calendarWrapper.nativeElement.contains(targetNode);

    if (!clickedInside) {
      this.closeCalendar();
    }
  }

  private emitValue(): void {
    if (!this.selectedStartDate && !this.selectedEndDate) {
      this.valueChange.emit(null);
      return;
    }

    if (this.mode === 'single') {
      this.valueChange.emit(this.selectedStartDate ? this.cloneDate(this.selectedStartDate) : null);
      return;
    }

    this.valueChange.emit({
      startDate: this.selectedStartDate ? this.cloneDate(this.selectedStartDate) : null,
      endDate: this.selectedEndDate ? this.cloneDate(this.selectedEndDate) : null,
    });
  }

  private buildCalendarDays(year: number, month: number): CalendarDay[] {
    const firstDayOfMonth = new Date(year, month, 1);
    const startWeekDay = this.getMondayBasedDayIndex(firstDayOfMonth);
    const gridStartDate = new Date(year, month, 1 - startWeekDay);

    return Array.from({ length: 42 }, (_, index) => {
      const currentDate = new Date(gridStartDate);
      currentDate.setDate(gridStartDate.getDate() + index);

      const normalizedDate = this.startOfDay(currentDate);
      const monthOffset = this.getMonthOffset(normalizedDate, year, month);

      const effectiveRangeEnd =
        this.mode === 'range' && this.selectedStartDate && !this.selectedEndDate && this.hoverDate
          ? this.hoverDate
          : this.selectedEndDate;

      const isSelectedSingle =
        this.mode === 'single' && this.selectedStartDate && this.isSameDate(normalizedDate, this.selectedStartDate);

      const isRangeStart =
        this.mode === 'range' && this.selectedStartDate && this.isSameDate(normalizedDate, this.selectedStartDate);

      const isRangeEnd =
        this.mode === 'range' && effectiveRangeEnd && this.isSameDate(normalizedDate, effectiveRangeEnd);

      const isInRange =
        this.mode === 'range' &&
        this.selectedStartDate &&
        effectiveRangeEnd &&
        this.isDateBetween(normalizedDate, this.selectedStartDate, effectiveRangeEnd);

      return {
        date: normalizedDate,
        dayNumber: normalizedDate.getDate(),
        monthOffset,
        disabled: this.isDateDisabled(normalizedDate),
        isToday: this.isSameDate(normalizedDate, this.startOfDay(new Date())),
        isSelected: Boolean(isSelectedSingle || isRangeStart || isRangeEnd),
        isRangeStart: Boolean(isRangeStart),
        isRangeEnd: Boolean(isRangeEnd),
        isInRange: Boolean(isInRange),
      };
    });
  }

  private getMondayBasedDayIndex(date: Date): number {
    const day = date.getDay();
    return day === 0 ? 6 : day - 1;
  }

  private getMonthOffset(date: Date, currentYear: number, currentMonth: number): -1 | 0 | 1 {
    const currentDateKey = currentYear * 12 + currentMonth;
    const targetDateKey = date.getFullYear() * 12 + date.getMonth();

    if (targetDateKey < currentDateKey) {
      return -1;
    }

    if (targetDateKey > currentDateKey) {
      return 1;
    }

    return 0;
  }

  private isDateBetween(date: Date, startDate: Date, endDate: Date): boolean {
    const start = this.startOfDay(startDate);
    const end = this.startOfDay(endDate);
    const current = this.startOfDay(date);

    const lower = start <= end ? start : end;
    const upper = start <= end ? end : start;

    return current > lower && current < upper;
  }

  private isBefore(firstDate: Date, secondDate: Date): boolean {
    return this.startOfDay(firstDate).getTime() < this.startOfDay(secondDate).getTime();
  }

  private isSameDate(firstDate: Date, secondDate: Date): boolean {
    return this.startOfDay(firstDate).getTime() === this.startOfDay(secondDate).getTime();
  }

  private formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  private startOfDay(date: Date): Date {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);
    return normalizedDate;
  }

  private cloneDate(date: Date): Date {
    return new Date(date.getTime());
  }

  private isDateDisabled(date: Date): boolean {
    if (this.mode === 'range' && this.selectedStartDate && !this.selectedEndDate) {
      return this.isBefore(date, this.selectedStartDate);
    }

    if (this.minDate) {
      return this.isBefore(date, this.minDate);
    }

    return false;
  }
}
