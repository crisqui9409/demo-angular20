/**
 * InputSelectCalendarComponent – Angular 20 Standalone
 * ─────────────────────────────────────────────────────────────────
 * Reusable calendar input component.
 * Supports both single-date selection and date-range selection.
 * Includes month/year navigation, disabled-date handling,
 * outside-click closing behavior, and formatted value emission.
 * ─────────────────────────────────────────────────────────────────
 * @author Carlos Nuncira / Contact & Business IT
 * @version 1.0.3, 2026/04/17 – Migrated to Angular 20 standalone + signals
 */
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { DEFAULT_CONST } from '../../../utils/global-strings';

/** Supported selection modes for the calendar component. */
type CalendarSelectionMode = 'single' | 'range';

/**
 * Represents a single day cell inside the calendar grid.
 * Includes rendering and state flags used by the template.
 */
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

/**
 * Output structure used when the component works in range mode.
 */
interface CalendarValue {
  startDate: Date | null;
  endDate: Date | null;
}

@Component({
  selector: 'bocc-input-select-calendar',
  standalone: true,
  templateUrl: './input-select-calendar.component.html',
  styleUrls: ['./input-select-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputSelectCalendarComponent {
  // ── View references ──────────────────────────────────────────────────────

  /**
   * Reference to the root wrapper element.
   * Used to detect clicks outside the component and close the calendar panel.
   */
  @ViewChild('calendarWrapper') calendarWrapper?: ElementRef<HTMLDivElement>;

  // ── Inputs ───────────────────────────────────────────────────────────────

  /** Label displayed above the calendar trigger field. */
  readonly label = input<string>('Fecha');

  /** Placeholder shown when no date has been selected yet. */
  readonly placeholder = input<string>('DD/MM/AAAA');

  /** Determines whether the component works in single or range mode. */
  readonly mode = input<CalendarSelectionMode>('single');

  /** Disables the trigger and all user interaction when true. */
  readonly disabled = input<boolean>(false);

  /**
   * Optional minimum selectable date.
   * When defined, any date before this value is disabled.
   */
  readonly minDate = input<Date | null>(null);

  /**
   * Optional date used to define the initial visible month and year.
   * When provided, the calendar opens on this month/year.
   */
  readonly initialViewDate = input<Date | null>(null);

  // ── Outputs ──────────────────────────────────────────────────────────────

  /**
   * Emits the selected value.
   * - In single mode: emits a Date or null
   * - In range mode: emits an object with startDate and endDate or null
   */
  readonly valueChange = output<Date | CalendarValue | null>();

  // ── Static display data ──────────────────────────────────────────────────

  /** Weekday labels displayed in the calendar header. */
  readonly weekDays: string[] = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];

  /** Month labels displayed in the month selector. */
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

  // ── Internal UI state ────────────────────────────────────────────────────

  /** Controls visibility of the calendar dropdown panel. */
  readonly isOpen = signal(false);

  /** Currently displayed month in the calendar view. */
  readonly currentMonth = signal(new Date().getMonth());

  /** Currently displayed year in the calendar view. */
  readonly currentYear = signal(new Date().getFullYear());

  /** First selected date in single mode or range mode. */
  readonly selectedStartDate = signal<Date | null>(null);

  /** Second selected date when the component is in range mode. */
  readonly selectedEndDate = signal<Date | null>(null);

  /**
   * Temporary hovered date used to preview the range
   * before the user confirms the second date.
   */
  readonly hoverDate = signal<Date | null>(null);

  constructor() {
    effect(() => {
      const initialViewDate = this.initialViewDate();
      const minDate = this.minDate();

      const baseDate = initialViewDate ?? minDate ?? new Date();
      const normalizedDate = this.startOfDay(baseDate);

      this.currentMonth.set(normalizedDate.getMonth());
      this.currentYear.set(normalizedDate.getFullYear());
    });
  }

  // ── Derived state ────────────────────────────────────────────────────────

  /**
   * Generates the list of selectable years for the year dropdown.
   * Uses initialViewDate first, then minDate, otherwise starts from current year - 5.
   */
  readonly years = computed(() => {
    const initialViewDate = this.initialViewDate();
    const minDate = this.minDate();
    const fallbackDate = this.startOfDay(new Date());

    const baseDate = initialViewDate ?? minDate ?? fallbackDate;
    const startYear = baseDate.getFullYear() - 5;

    return Array.from({ length: 11 }, (_, index) => startYear + index);
  });

  /**
   * Builds the 6-week calendar grid for the current month and year.
   */
  readonly days = computed(() => {
    return this.buildCalendarDays(this.currentYear(), this.currentMonth());
  });

  /**
   * Formats the value shown in the trigger field.
   * Supports single-date and range display formats.
   */
  readonly displayValue = computed(() => {
    const mode = this.mode();
    const selectedStartDate = this.selectedStartDate();
    const selectedEndDate = this.selectedEndDate();

    if (mode === 'single') {
      return selectedStartDate ? this.formatDate(selectedStartDate) : DEFAULT_CONST.EMPTY;
    }

    if (selectedStartDate && selectedEndDate) {
      return `${this.formatDate(selectedStartDate)} - ${this.formatDate(selectedEndDate)}`;
    }

    if (selectedStartDate) {
      return `${this.formatDate(selectedStartDate)} -`;
    }

    return DEFAULT_CONST.EMPTY;
  });

  // ── Trigger and panel interactions ───────────────────────────────────────

  /**
   * Opens or closes the calendar panel.
   * Does nothing when the component is disabled.
   */
  toggleCalendar(): void {
    if (this.disabled()) {
      return;
    }

    this.isOpen.update((currentValue) => !currentValue);
  }

  /**
   * Closes the calendar panel and clears temporary hover preview state.
   */
  closeCalendar(): void {
    this.isOpen.set(false);
    this.hoverDate.set(null);
  }

  // ── Header interactions ──────────────────────────────────────────────────

  /**
   * Updates the current month when the month selector changes.
   */
  onMonthChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.currentMonth.set(Number(target.value));
  }

  /**
   * Updates the current year when the year selector changes.
   */
  onYearChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.currentYear.set(Number(target.value));
  }

  /**
   * Navigates to the previous month.
   * Adjusts the year when moving back from January.
   */
  onPreviousMonth(): void {
    if (this.currentMonth() === 0) {
      this.currentMonth.set(11);
      this.currentYear.update((year) => year - 1);
      return;
    }

    this.currentMonth.update((month) => month - 1);
  }

  /**
   * Navigates to the next month.
   * Adjusts the year when moving forward from December.
   */
  onNextMonth(): void {
    if (this.currentMonth() === 11) {
      this.currentMonth.set(0);
      this.currentYear.update((year) => year + 1);
      return;
    }

    this.currentMonth.update((month) => month + 1);
  }

  // ── Day interactions ─────────────────────────────────────────────────────

  /**
   * Updates temporary hover state to preview a range selection.
   * Only active in range mode after the first date has been selected.
   */
  onDayHover(day: CalendarDay): void {
    if (this.mode() !== 'range' || day.disabled || !this.selectedStartDate() || this.selectedEndDate()) {
      return;
    }

    this.hoverDate.set(day.date);
  }

  /**
   * Clears the temporary hover state used for range preview.
   */
  onDayLeave(): void {
    this.hoverDate.set(null);
  }

  /**
   * Handles day selection.
   * - In single mode, selects one date and closes the panel
   * - In range mode, selects start and end dates in sequence
   */
  onDaySelect(day: CalendarDay): void {
    if (day.disabled) {
      return;
    }

    if (this.mode() === 'single') {
      this.selectedStartDate.set(this.cloneDate(day.date));
      this.selectedEndDate.set(null);
      this.emitValue();
      this.closeCalendar();
      return;
    }

    if (!this.selectedStartDate() || (this.selectedStartDate() && this.selectedEndDate())) {
      this.selectedStartDate.set(this.cloneDate(day.date));
      this.selectedEndDate.set(null);
      this.hoverDate.set(null);
      this.emitValue();
      return;
    }

    const selectedStartDate = this.selectedStartDate();

    if (selectedStartDate && this.isBefore(day.date, selectedStartDate)) {
      this.selectedEndDate.set(this.cloneDate(selectedStartDate));
      this.selectedStartDate.set(this.cloneDate(day.date));
      this.emitValue();
      return;
    }

    this.selectedEndDate.set(this.cloneDate(day.date));
    this.emitValue();
    this.closeCalendar();
  }

  /**
   * Clears the current selection and emits a null value.
   */
  clearSelection(): void {
    this.selectedStartDate.set(null);
    this.selectedEndDate.set(null);
    this.hoverDate.set(null);
    this.emitValue();
  }

  /**
   * TrackBy function for stable day rendering in the calendar grid.
   */
  trackByDay(_: number, day: CalendarDay): string {
    return day.date.toISOString();
  }

  /**
   * Resolves CSS classes for a calendar day button based on its state.
   */
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

  // ── Global interactions ──────────────────────────────────────────────────

  /**
   * Closes the calendar panel when the user clicks outside the component.
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isOpen() || !this.calendarWrapper) {
      return;
    }

    const targetNode = event.target as Node;
    const clickedInside = this.calendarWrapper.nativeElement.contains(targetNode);

    if (!clickedInside) {
      this.closeCalendar();
    }
  }

  // ── Emission logic ───────────────────────────────────────────────────────

  /**
   * Emits the current selected value to the parent component.
   * Output format depends on the current selection mode.
   */
  private emitValue(): void {
    const selectedStartDate = this.selectedStartDate();
    const selectedEndDate = this.selectedEndDate();

    if (!selectedStartDate && !selectedEndDate) {
      this.valueChange.emit(null);
      return;
    }

    if (this.mode() === 'single') {
      this.valueChange.emit(selectedStartDate ? this.cloneDate(selectedStartDate) : null);
      return;
    }

    this.valueChange.emit({
      startDate: selectedStartDate ? this.cloneDate(selectedStartDate) : null,
      endDate: selectedEndDate ? this.cloneDate(selectedEndDate) : null,
    });
  }

  // ── Calendar generation ──────────────────────────────────────────────────

  /**
   * Builds a 42-cell calendar grid for the given month and year.
   * Includes previous/next month overflow days to complete the grid.
   */
  private buildCalendarDays(year: number, month: number): CalendarDay[] {
    const firstDayOfMonth = new Date(year, month, 1);
    const startWeekDay = this.getMondayBasedDayIndex(firstDayOfMonth);
    const gridStartDate = new Date(year, month, 1 - startWeekDay);

    return Array.from({ length: 42 }, (_, index) => {
      const currentDate = new Date(gridStartDate);
      currentDate.setDate(gridStartDate.getDate() + index);

      const normalizedDate = this.startOfDay(currentDate);
      const monthOffset = this.getMonthOffset(normalizedDate, year, month);

      const selectedStartDate = this.selectedStartDate();
      const selectedEndDate = this.selectedEndDate();
      const hoverDate = this.hoverDate();
      const mode = this.mode();

      const effectiveRangeEnd =
        mode === 'range' && selectedStartDate && !selectedEndDate && hoverDate ? hoverDate : selectedEndDate;

      const isSelectedSingle =
        mode === 'single' && selectedStartDate && this.isSameDate(normalizedDate, selectedStartDate);

      const isRangeStart = mode === 'range' && selectedStartDate && this.isSameDate(normalizedDate, selectedStartDate);

      const isRangeEnd = mode === 'range' && effectiveRangeEnd && this.isSameDate(normalizedDate, effectiveRangeEnd);

      const isInRange =
        mode === 'range' &&
        selectedStartDate &&
        effectiveRangeEnd &&
        this.isDateBetween(normalizedDate, selectedStartDate, effectiveRangeEnd);

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

  /**
   * Converts JavaScript weekday index to a Monday-based index.
   * Monday = 0, Sunday = 6.
   */
  private getMondayBasedDayIndex(date: Date): number {
    const day = date.getDay();
    return day === 0 ? 6 : day - 1;
  }

  /**
   * Determines whether a date belongs to the previous, current,
   * or next month relative to the current calendar view.
   */
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

  // ── Date comparison helpers ──────────────────────────────────────────────

  /**
   * Returns true when the given date is strictly between the start and end dates.
   */
  private isDateBetween(date: Date, startDate: Date, endDate: Date): boolean {
    const start = this.startOfDay(startDate);
    const end = this.startOfDay(endDate);
    const current = this.startOfDay(date);

    const lower = start <= end ? start : end;
    const upper = start <= end ? end : start;

    return current > lower && current < upper;
  }

  /**
   * Returns true when the first date is before the second date.
   */
  private isBefore(firstDate: Date, secondDate: Date): boolean {
    return this.startOfDay(firstDate).getTime() < this.startOfDay(secondDate).getTime();
  }

  /**
   * Returns true when both dates represent the same calendar day.
   */
  private isSameDate(firstDate: Date, secondDate: Date): boolean {
    return this.startOfDay(firstDate).getTime() === this.startOfDay(secondDate).getTime();
  }

  /**
   * Formats a date as DD/MM/YYYY.
   */
  private formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  /**
   * Normalizes a date to the start of the day.
   * Used to avoid time-based comparison issues.
   */
  private startOfDay(date: Date): Date {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);
    return normalizedDate;
  }

  /**
   * Creates a safe copy of a date object.
   */
  private cloneDate(date: Date): Date {
    return new Date(date.getTime());
  }

  /**
   * Returns true when a date should be disabled.
   * In range mode, dates before the selected start date are disabled
   * while the user is selecting the end date.
   * Also respects minDate when provided.
   */
  private isDateDisabled(date: Date): boolean {
    const selectedStartDate = this.selectedStartDate();
    const selectedEndDate = this.selectedEndDate();
    const minDate = this.minDate();

    if (this.mode() === 'range' && selectedStartDate && !selectedEndDate) {
      return this.isBefore(date, selectedStartDate);
    }

    if (minDate) {
      return this.isBefore(date, minDate);
    }

    return false;
  }
}
