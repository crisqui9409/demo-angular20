/**
 * AvatarComponent – Angular 20 Standalone
 * ─────────────────────────────────────────────────────────────────
 * Avatar atom. Displays a user's profile image or a placeholder,
 * and an expandable profile panel with role and name.
 *
 * @author  : Cristian Quintana / Contact & Business IT
 * @version : 1.1 – 2026/04/15
 * ─────────────────────────────────────────────────────────────────
 */
import { Component, input } from '@angular/core';
import { ES_AVATAR } from '../../../utils/lang/es_component';
import { TextPipe } from '../../../pipes/text-pipe';

@Component({
  selector: 'bocc-avatar',
  standalone: true,
  imports: [TextPipe],
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent {
  /** URL source for the user's profile image. Falls back to a placeholder if null. */
  imageUrl = input<string | null>(null);

  /** Primary text displayed in the avatar panel, typically the user's full name. */
  titleText = input<string>(ES_AVATAR.DEFAULT_OPTIONS.NAME);

  /** Secondary text shown below the title, typically representing the job role or area. */
  subtitleText = input<string>(ES_AVATAR.DEFAULT_OPTIONS.POSITION_COMPANY);

  /** Controls whether the panel is wide (showing text) or collapsed (showing only the image). */
  isExpanded = input<boolean>(true);
}
