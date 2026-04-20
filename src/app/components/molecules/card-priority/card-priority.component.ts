import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuClicComponent } from '../../atoms/menu-clic/menu-clic.component';

/**
 * Component to display and select priority options.
 * Implementation using MenuClic atom as per design requirements.
 *
 * @example
 * <bocc-card-priority 
 *  [options]="priorityOptions" 
 *  (prioritySelected)="handlePrioritySelected($event)">
 * </bocc-card-priority>
 */
@Component({
  selector: 'bocc-card-priority',
  standalone: true,
  imports: [CommonModule, MenuClicComponent],
  templateUrl: './card-priority.component.html',
  styleUrl: './card-priority.component.scss',
})
export class CardPriorityComponent {
  /**
   * List of priority options to display.
   */
  public options = input<string[]>([]);

  /**
   * Output that emits the text of the selected priority option.
   */
  prioritySelected = output<string>();

  /**
   * Handles the selection of a priority option.
   * @param priority Selected priority label.
   */
  public onSelect(priority: string): void {
    this.prioritySelected.emit(priority);
  }
}
