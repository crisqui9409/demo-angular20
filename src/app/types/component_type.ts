/**
 * component_type – Angular 20 Standalone
 * ─────────────────────────────────────────────────────────────────
 * Specific data types for the use of the components
 *
 * @author  : Natalia Melendez / Contact & Business IT
 * @version : 1.0 – 2026/04/15
 * ─────────────────────────────────────────────────────────────────
 */

// Avatar component types
export type AvatarImageMode = 'none' | 'placeholder' | 'initials' | 'image';
export type AvatarStatus = 'none' | 'disponible' | 'ocupado' | 'no-disponible' | 'desconectado';
export enum TooltipOrientation {
  Top = 'top',
  Bottom = 'bottom',
  Left = 'left',
  Right = 'right',
}

// Button component types
/** Supported visual variants for the button. */
export type ButtonVariant = 'btn-primary' | 'btn-secondary' | 'btn-gradient-blue';
/** Final CSS class applied to the root button depending on current state. */
export type ButtonResolvedClass = ButtonVariant | 'btn-inactive' | 'btn-inactive-primary';