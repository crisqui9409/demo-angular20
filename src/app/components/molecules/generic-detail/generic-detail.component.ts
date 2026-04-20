/**
 * GenericDetailComponent – Angular 20 Standalone
 * ─────────────────────────────────────────────────────────────────
 * Component for displaying information about selected records.
 * Supports no selection or multiple selections.
 * 
 * Note: The height, width, and position of the component—as well as
 * whether its elements appear centered—depend on the parent container,
 * specifically its width, height, and position.
 *
 * @author  : Natalia Melendez / Contact & Business IT
 * @version : 1.0 – 2026/04/17
 * ─────────────────────────────────────────────────────────────────
 * @example
 * <bocc-generic-detail [hasSelected]="true" [numberRows]="'10'" (handleClicButton)="function($event)"></bocc-generic-detail>
 */

import { Component, input, output } from '@angular/core';
import { TextPipe } from '../../../pipes/text-pipe';
import { MasterIconComponent } from '../../atoms/master-icon/master-icon.component';
import { ButtonComponent } from '../../atoms/button/button.component';

@Component({
  selector: 'bocc-generic-detail',
  imports: [MasterIconComponent, ButtonComponent, TextPipe],
  templateUrl: './generic-detail.component.html',
  styleUrl: './generic-detail.component.scss',
})
export class GenericDetailComponent {
  /**
	 * Flag to show details of selected or unselected records
	 * Valid Values: boolean
	 */
  hasSelected = input<boolean>(false);
  /**
	 * Number of selected records to display
   * It is only used if hasSelected is true
	 * Valid Values: string
	 */
  numberRows = input<string>('0');
  /**
	 * Event emitter for the button click that only appears when hasSelected is true
	 */
  readonly handleClicButton = output<void>();

   /**
   * Emits the click event when the button.
   */
  onButtonClick(): void {
    this.handleClicButton.emit();
  }
}
