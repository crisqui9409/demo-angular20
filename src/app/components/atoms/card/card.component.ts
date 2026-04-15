import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

type CardPadding = 'none' | 'sm' | 'md' | 'lg';
type CardRadius = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ui-card',
  standalone: true,
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiCardComponent {
  @Input() padding: CardPadding = 'md';
  @Input() radius: CardRadius = 'md';
  @Input() fullHeight = false;

  get cardClass(): string {
    const classes = [
      'card',
      `card--padding-${this.padding}`,
      `card--radius-${this.radius}`,
    ];

    if (this.fullHeight) {
      classes.push('card--full-height');
    }

    return classes.join(' ');
  }
}