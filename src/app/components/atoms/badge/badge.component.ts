import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DEFAULT_CONST } from '../../../utils/global-strings';

type BadgeVariant = 'high' | 'medium' | 'low';

@Component({
  selector: 'ui-badge',
  standalone: true,
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiBadgeComponent {
  @Input() label: string = DEFAULT_CONST.EMPTY;
  @Input() variant: BadgeVariant = 'medium';

  get badgeClass(): string {
    return `badge badge--${this.variant}`;
  }
}