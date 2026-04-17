import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Defines the structure of a single breadcrumb navigation node.
 */
export interface BreadcrumbItem {
  /** The display label for the navigation link. */
  label: string;
  /** 
   * The destination route path. 
   * Optional for the terminal (current) page item.
   */
  path?: string;
  /** 
   * SVG string or icon identifier to render as a prefix.
   * Renders via [innerHTML] context.
   */
  icon?: string;
  /** Flag to indicate if this is the current active segment. */
  active?: boolean;
}

/**
 * BreadcrumbComponent
 * 
 * An atomic navigation component that tracks the user's location within the application's hierarchy.
 * Optimized for performance using Angular Signals and semantic HTML5 structures.
 * 
 * @example
 * <bocc-breadcrumb [items]="breadcrumbItems" />
 */
@Component({
  selector: 'bocc-breadcrumb',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class BreadcrumbComponent {
  /** Reactive input for the list of breadcrumb items. */
  items = input<BreadcrumbItem[]>([]);
}
