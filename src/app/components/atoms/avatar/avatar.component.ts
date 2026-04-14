import { Component, input } from '@angular/core';

export type AvatarSize = '16' | '24' | '32';
export type AvatarImageMode = 'none' | 'placeholder' | 'initials' | 'image';
export type AvatarStatus = 'none' | 'disponible' | 'ocupado' | 'no-disponible' | 'desconectado';

@Component({
  selector: 'bocc-avatar',
  standalone: true,
  imports: [],
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  host: {
    '[class.bocc-size-16]': 'size() === "16"',
    '[class.bocc-size-24]': 'size() === "24"',
    '[class.bocc-size-32]': 'size() === "32"',
    '[class.bocc-status-none]': 'status() === "none"',
    '[class.bocc-status-disponible]': 'status() === "disponible"',
    '[class.bocc-status-ocupado]': 'status() === "ocupado"',
    '[class.bocc-status-no-disponible]': 'status() === "no-disponible"',
    '[class.bocc-status-desconectado]': 'status() === "desconectado"'
  }
})
export class AvatarComponent {
  // Appearance properties
  size = input<AvatarSize>('32');
  imageMode = input<AvatarImageMode>('image');
  imageUrl = input<string | null>(null);
  initialsText = input<string | null>(null);
  status = input<AvatarStatus>('disponible');

  // Content properties
  titleText = input<string>('Short title');
  subtitleText = input<string>('Caption');

  // Visibility toggles
  showContent = input<boolean>(true);
  showTitle = input<boolean>(true);
  showSubtitle = input<boolean>(true);
}
