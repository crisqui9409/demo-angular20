import { SelectCoordinatorService } from './select-coordinator.service';
import { take } from 'rxjs';

describe('SelectCoordinatorService', () => {
  let service: SelectCoordinatorService;

  beforeEach(() => {
    service = new SelectCoordinatorService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('selectOpen$ should initially emit null', (done) => {
    service.selectOpen$.pipe(take(1)).subscribe(val => {
      expect(val).toBeNull();
      done();
    });
  });

  it('openSelect should emit the provided ID', (done) => {
    const testId = 'test-id-123';
    service.selectOpen$.pipe(take(2)).subscribe({
      next: (val) => {
        if (val === testId) {
          expect(val).toBe(testId);
          done();
        }
      }
    });
    service.openSelect(testId);
  });

  it('closeAllSelects should emit null', (done) => {
    service.openSelect('active-id');
    service.selectOpen$.pipe(take(2)).subscribe({
      next: (val) => {
        if (val === null) {
          expect(val).toBeNull();
          done();
        }
      }
    });
    service.closeAllSelects();
  });
});
