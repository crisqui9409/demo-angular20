import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DEFAULT_CONST } from '../../../utils/global-strings';

type ButtonVariant = 'btn-primary' | 'btn-secondary';
type ButtonResolvedClass = ButtonVariant | 'btn-inactive' | 'btn-inactive-primary';

@Component({
  selector: 'ui-button',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiButtonComponent {
  private isHovered = false;

  @Input() variant: ButtonVariant = 'btn-primary';
  @Input() label: string = DEFAULT_CONST.EMPTY;
  @Input() disabled = false;
  @Input() showIcon = false;
  @Input() enableHoverIcon = false;
  @Input() iconDefault: string = DEFAULT_CONST.EMPTY;
  @Input() iconOnHover: string = DEFAULT_CONST.EMPTY;
  @Input() iconOnDisabled: string = DEFAULT_CONST.EMPTY;

  @Output() readonly buttonClick = new EventEmitter<void>();

  get resolvedClass(): ButtonResolvedClass {
    if (!this.disabled) {
      return this.variant;
    }

    return this.variant === 'btn-primary' ? 'btn-inactive-primary' : 'btn-inactive';
  }

  get resolvedIcon(): string {
    if (this.disabled) {
      return this.iconOnDisabled || this.iconDefault;
    }

    if (this.enableHoverIcon && this.isHovered && this.iconOnHover) {
      return this.iconOnHover;
    }

    return this.iconDefault;
  }

  get hasLabel(): boolean {
    return this.label.trim().length > 0;
  }

  get iconBackgroundImage(): string {
    return this.resolvedIcon ? `url(${this.resolvedIcon})` : 'none';
  }

  onClick(): void {
    if (this.disabled) {
      return;
    }

    this.buttonClick.emit();
  }

  onMouseEnter(): void {
    if (this.enableHoverIcon) {
      this.isHovered = true;
    }
  }

  onMouseLeave(): void {
    if (this.enableHoverIcon) {
      this.isHovered = false;
    }
  }
}
