/**
 * SelectCoordinatorService
 * ─────────────────────────────────────────────────────────────────
 * Singleton that tracks which dropdown is currently open so that
 * opening one automatically closes all other instances.
 *
 * Author  : Cristian Quintana / Contact & Business IT
 * Version : 1.0 – 2026/04/13 (Angular 20)
 * ─────────────────────────────────────────────────────────────────
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SelectCoordinatorService {
  private readonly _selectOpen$ = new BehaviorSubject<string | null>(null);

  /** Observable: emits the ID of the currently open select (or null). */
  readonly selectOpen$ = this._selectOpen$.asObservable();

  /** Mark a specific dropdown as open. All others will close. */
  openSelect(id: string): void {
    this._selectOpen$.next(id);
  }

  /** Close every dropdown. */
  closeAllSelects(): void {
    this._selectOpen$.next(null);
  }
}
