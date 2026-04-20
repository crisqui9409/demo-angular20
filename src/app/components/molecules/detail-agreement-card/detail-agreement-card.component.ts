/**
 * Component to display the details of an agreement in a card format.
 * @author Sebastian Barreto / Contact & Business IT
 * @version 1.0, 2026/04/17 – Initial creation
 *
 * @example
 * <bocc-detail-agreement-card
    [zone]="'Zona Norte'"
    [channel]="'Digital'"
    [segment]="'Preferencial'"
    [payrollLoanType]="'Libranza Tradicional'"
    [portfolioStatus]="'Vigente'"
    [closing]="'2026-05-30'"
    [customerIdentification]="'1020304050'"
    [creditNumber]="'8877665544'"
    [customerName]="'Juan Pérez'"
    [agreementNit]="'800.123.456-1'">
  </bocc-detail-agreement-card>
 */
import { Component, input, signal } from '@angular/core';

import { MasterIconComponent } from '../../atoms/master-icon/master-icon.component';

@Component({
  selector: 'bocc-detail-agreement-card',
  standalone: true,
  imports: [MasterIconComponent],
  templateUrl: './detail-agreement-card.component.html',
  styleUrl: './detail-agreement-card.component.scss',
})
export class DetailAgreementCardComponent {
  public zone = input.required<string>();
  public channel = input.required<string>();
  public segment = input.required<string>();
  public payrollLoanType = input.required<string>();
  public portfolioStatus = input.required<string>();
  public closing = input.required<string>();
  public customerIdentification = input.required<string>();
  public creditNumber = input.required<string>();
  public customerName = input.required<string>();
  public agreementNit = input.required<string>();

  public isExpanded = signal(false);

  public toggleExpanded(): void {
    this.isExpanded.update((v) => !v);
  }
}
