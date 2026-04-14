import { ChangeDetectionStrategy, Component, computed, EventEmitter, input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DEFAULT_CONST } from '../../../utils/global-strings';

type ButtonVariant = 'btn-primary' | 'btn-secondary';
type ButtonResolvedClass = ButtonVariant | 'btn-inactive' | 'btn-inactive-primary';

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiButtonComponent {
  private readonly isHovered = signal(false);

  readonly variant = input<ButtonVariant>('btn-primary');
  readonly label = input<string>(DEFAULT_CONST.EMPTY);
  readonly disabled = input<boolean>(false);
  readonly showIcon = input<boolean>(false);
  readonly enableHoverIcon = input<boolean>(false);
  readonly iconDefault = input<string>(DEFAULT_CONST.EMPTY);
  readonly iconOnHover = input<string>(DEFAULT_CONST.EMPTY);
  readonly iconOnDisabled = input<string>(DEFAULT_CONST.EMPTY);

  @Output() readonly buttonClick = new EventEmitter<void>();

  readonly resolvedClass = computed<ButtonResolvedClass>(() => {
    if (!this.disabled()) {
      return this.variant();
    }

    return this.variant() === 'btn-primary' ? 'btn-inactive-primary' : 'btn-inactive';
  });

  readonly resolvedIcon = computed<string>(() => {
    if (this.disabled()) {
      return this.iconOnDisabled() || this.iconDefault();
    }

    if (this.enableHoverIcon() && this.isHovered() && this.iconOnHover()) {
      return this.iconOnHover();
    }

    return this.iconDefault();
  });

  onClick(): void {
    if (this.disabled()) {
      return;
    }

    this.buttonClick.emit();
  }

  onMouseEnter(): void {
    if (!this.enableHoverIcon()) {
      return;
    }

    this.isHovered.set(true);
  }

  onMouseLeave(): void {
    if (!this.enableHoverIcon()) {
      return;
    }

    this.isHovered.set(false);
  }
}
