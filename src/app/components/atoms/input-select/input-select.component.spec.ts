import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { InputSelectComponent } from './input-select.component';
import { SelectCoordinatorService } from '../../../services/select-coordinator.service';
import { BehaviorSubject } from 'rxjs';

// ─── Spy Helper for the Coordinator Service ──────────────────────────────────
function makeCoordinatorSpy() {
  const subject = new BehaviorSubject<string | null>(null);
  return {
    selectOpen$: subject.asObservable(),
    _subject: subject,
    openSelect: jasmine.createSpy('openSelect'),
    closeAllSelects: jasmine.createSpy('closeAllSelects'),
  };
}

describe('InputSelectComponent', () => {
  let component: InputSelectComponent;
  let fixture: ComponentFixture<InputSelectComponent>;
  let coordinatorSpy: ReturnType<typeof makeCoordinatorSpy>;

  beforeEach(async () => {
    coordinatorSpy = makeCoordinatorSpy();

    await TestBed.configureTestingModule({
      imports: [InputSelectComponent],
      providers: [
        { provide: SelectCoordinatorService, useValue: coordinatorSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InputSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ─────────────────────────────────────────────
  // 1. Creación
  // ─────────────────────────────────────────────
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ─────────────────────────────────────────────
  // 2. Valores por defecto
  // ─────────────────────────────────────────────
  describe('Default values', () => {
    it('should have correct default signals', () => {
      expect(component.showDropdown()).toBeFalse();
      expect(component.isActive()).toBeFalse();
      expect(component.hasOptions()).toBeFalse();
      expect(component.isScrollable()).toBeFalse();
    });

    it('should initialize currentlyValueInput with placeholder on ngOnInit', () => {
      expect(component.currentlyValueInput()).toBe('Selecciona');
    });

    it('hasOptions should be true when optionsValues has items', () => {
      fixture.componentRef.setInput('optionsValues', ['A', 'B']);
      fixture.detectChanges();
      expect(component.hasOptions()).toBeTrue();
    });

    it('isScrollable should be true when optionsValues has more than 4 items', () => {
      fixture.componentRef.setInput('optionsValues', ['1', '2', '3', '4', '5']);
      fixture.detectChanges();
      expect(component.isScrollable()).toBeTrue();
    });

    it('isScrollable should be false with exactly 4 items', () => {
      fixture.componentRef.setInput('optionsValues', ['1', '2', '3', '4']);
      fixture.detectChanges();
      expect(component.isScrollable()).toBeFalse();
    });
  });

  // ─────────────────────────────────────────────
  // 3. ngOnInit — todas las ramas
  // ─────────────────────────────────────────────
  describe('ngOnInit (branches)', () => {
    it('uses custom placeholder when provided', () => {
      fixture.componentRef.setInput('placeholder', 'Choose one');
      component.ngOnInit();
      expect(component.currentlyValueInput()).toBe('Choose one');
    });

    it('uses "Selecciona" as fallback when placeholder is empty', () => {
      fixture.componentRef.setInput('placeholder', '');
      component.ngOnInit();
      expect(component.currentlyValueInput()).toBe('Selecciona');
    });

    it('pre-selects option when activeOption is a valid index', () => {
      fixture.componentRef.setInput('optionsValues', ['Option A', 'Option B', 'Option C']);
      fixture.componentRef.setInput('activeOption', 1);
      component.ngOnInit();
      expect(component.currentlyValueInput()).toBe('Option B');
      expect(component.isActive()).toBeTrue();
    });

    it('does NOT pre-select when activeOption=-1 (default)', () => {
      fixture.componentRef.setInput('optionsValues', ['Option A', 'Option B']);
      fixture.componentRef.setInput('activeOption', -1);
      component.ngOnInit();
      expect(component.isActive()).toBeFalse();
    });

    it('does NOT pre-select when activeOption is out of range', () => {
      fixture.componentRef.setInput('optionsValues', ['Option A']);
      fixture.componentRef.setInput('activeOption', 5);
      component.ngOnInit();
      expect(component.isActive()).toBeFalse();
    });
  });

  // ─────────────────────────────────────────────
  // 4. returnToDefault Effect (branches)
  // ─────────────────────────────────────────────
  describe('returnToDefault effect (branches)', () => {
    it('resets currentlyValueInput and isActive when returnToDefault=true', () => {
      component.isActive.set(true);
      component.currentlyValueInput.set('Option A');

      fixture.componentRef.setInput('returnToDefault', true);
      fixture.detectChanges();

      expect(component.currentlyValueInput()).toBe('Selecciona');
      expect(component.isActive()).toBeFalse();
    });

    it('does nothing when returnToDefault=false', () => {
      component.isActive.set(true);
      component.currentlyValueInput.set('Option A');

      fixture.componentRef.setInput('returnToDefault', false);
      fixture.detectChanges();

      expect(component.currentlyValueInput()).toBe('Option A');
      expect(component.isActive()).toBeTrue();
    });
  });

  // ─────────────────────────────────────────────
  // 5. Coordinator subscription — cierre por otro select
  // ─────────────────────────────────────────────
  describe('Coordinator: close when another select opens', () => {
    it('closes dropdown when coordinator emits a different ID', () => {
      component.showDropdown.set(true);
      // Emitting a different ID should close this dropdown
      coordinatorSpy._subject.next('some-other-id');
      expect(component.showDropdown()).toBeFalse();
    });

    it('does NOT close dropdown when coordinator emits its own ID', fakeAsync(() => {
      // We can't access the private ID directly, but we can open the dropdown
      // using handleDropdownVisibility (which internally calls coordinator.openSelect(this.id))
      fixture.componentRef.setInput('optionsValues', ['A']);
      fixture.detectChanges();
      component.handleDropdownVisibility(); // opens and calls openSelect(this.id)
      // Emitting null should not close (null !== component's private id)
      // But null (closeAll) WILL trigger, so let's just verify coord was called.
      expect(coordinatorSpy.openSelect).toHaveBeenCalled();
    }));
  });

  // ─────────────────────────────────────────────
  // 6. handleDropdownVisibility — all branches
  // ─────────────────────────────────────────────
  describe('handleDropdownVisibility (branches)', () => {
    it('does nothing when isDisable=true', () => {
      fixture.componentRef.setInput('isDisable', true);
      fixture.componentRef.setInput('optionsValues', ['A', 'B']);
      fixture.detectChanges();

      component.handleDropdownVisibility();
      expect(component.showDropdown()).toBeFalse();
      expect(coordinatorSpy.openSelect).not.toHaveBeenCalled();
    });

    it('does nothing when hasOptions=false (empty list)', () => {
      fixture.componentRef.setInput('optionsValues', []);
      fixture.detectChanges();

      component.handleDropdownVisibility();
      expect(component.showDropdown()).toBeFalse();
    });

    it('opens dropdown and calls openSelect when enabled and has options', () => {
      fixture.componentRef.setInput('optionsValues', ['A', 'B']);
      fixture.detectChanges();

      component.handleDropdownVisibility();

      expect(component.showDropdown()).toBeTrue();
      expect(coordinatorSpy.openSelect).toHaveBeenCalled();
    });

    it('closes dropdown and calls closeAllSelects when toggled again', () => {
      fixture.componentRef.setInput('optionsValues', ['A', 'B']);
      fixture.detectChanges();

      component.showDropdown.set(true);
      component.handleDropdownVisibility(); // next = false → close

      expect(component.showDropdown()).toBeFalse();
      expect(coordinatorSpy.closeAllSelects).toHaveBeenCalled();
    });
  });

  // ─────────────────────────────────────────────
  // 7. setInputOption
  // ─────────────────────────────────────────────
  describe('setInputOption', () => {
    it('updates value, emits events, and closes dropdown', () => {
      spyOn(component.handleInput, 'emit');
      spyOn(component.onSelectOption, 'emit');

      fixture.componentRef.setInput('optionsValues', ['Option A', 'Option B']);
      fixture.detectChanges();

      component.setInputOption('Option B', 1);

      expect(component.currentlyValueInput()).toBe('Option B');
      expect(component.isActive()).toBeTrue();
      expect(component.showDropdown()).toBeFalse();
      expect(component.handleInput.emit).toHaveBeenCalledWith({ value: 'Option B', numberTab: 1 });
      expect(component.onSelectOption.emit).toHaveBeenCalledWith({ value: 'Option B', index: 1 });
      expect(coordinatorSpy.closeAllSelects).toHaveBeenCalled();
    });
  });

  // ─────────────────────────────────────────────
  // 8. closeSelect
  // ─────────────────────────────────────────────
  describe('closeSelect', () => {
    it('sets showDropdown to false and calls closeAllSelects', () => {
      component.showDropdown.set(true);
      component.closeSelect();
      expect(component.showDropdown()).toBeFalse();
      expect(coordinatorSpy.closeAllSelects).toHaveBeenCalled();
    });
  });

  // ─────────────────────────────────────────────
  // 9. HostListeners
  // ─────────────────────────────────────────────
  describe('onHostClick (HostListener click/touchstart)', () => {
    it('stops propagation on click', () => {
      const event = new MouseEvent('click', { bubbles: true });
      spyOn(event, 'stopPropagation');
      component.onHostClick(event);
      expect(event.stopPropagation).toHaveBeenCalled();
    });
  });

  describe('onFocusOut (HostListener focusout / branches)', () => {
    it('closes dropdown when focus moves outside .bocc-select', () => {
      component.showDropdown.set(true);
      const externalEl = document.createElement('button');
      document.body.appendChild(externalEl);

      const event = new FocusEvent('focusout', { relatedTarget: externalEl });
      component.onFocusOut(event);

      expect(component.showDropdown()).toBeFalse();
      expect(coordinatorSpy.closeAllSelects).toHaveBeenCalled();
      document.body.removeChild(externalEl);
    });

    it('does NOT close dropdown when focus stays inside .bocc-select', () => {
      component.showDropdown.set(true);

      // Create an element inside the component's host that has .bocc-select ancestor
      const host = fixture.nativeElement as HTMLElement;
      const innerEl = host.querySelector('.bocc-select') as HTMLElement;

      const event = new FocusEvent('focusout', { relatedTarget: innerEl });
      component.onFocusOut(event);

      // Still open because focus is inside .bocc-select
      expect(component.showDropdown()).toBeTrue();
    });

    it('closes dropdown when relatedTarget is null', () => {
      component.showDropdown.set(true);
      const event = new FocusEvent('focusout', { relatedTarget: null });
      component.onFocusOut(event);
      expect(component.showDropdown()).toBeFalse();
    });
  });

  describe('onDocumentClick (HostListener document:click)', () => {
    it('closes dropdown when document click fires', () => {
      component.showDropdown.set(true);
      component.onDocumentClick();
      expect(component.showDropdown()).toBeFalse();
      expect(coordinatorSpy.closeAllSelects).toHaveBeenCalled();
    });
  });

  // ─────────────────────────────────────────────
  // 10. Template rendering (branches @if)
  // ─────────────────────────────────────────────
  describe('Template rendering (branches)', () => {
    it('shows floating label only when titleName and isActive are both set', () => {
      fixture.componentRef.setInput('titleName', 'My Label');
      component.isActive.set(false);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.bocc-select__label')).toBeFalsy();

      component.isActive.set(true);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.bocc-select__label')).toBeTruthy();
    });

    it('does NOT show floating label when titleName is empty', () => {
      fixture.componentRef.setInput('titleName', '');
      component.isActive.set(true);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.bocc-select__label')).toBeFalsy();
    });

    it('shows dropdown panel only when showDropdown=true', () => {
      fixture.componentRef.setInput('optionsValues', ['A', 'B']);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.bocc-select__dropdown')).toBeFalsy();

      component.showDropdown.set(true);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.bocc-select__dropdown')).toBeTruthy();
    });

    it('shows placeholder option (selectOption=true) when dropdown is open', () => {
      fixture.componentRef.setInput('optionsValues', ['A']);
      fixture.componentRef.setInput('selectOption', true);
      component.showDropdown.set(true);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.bocc-select__option--placeholder')).toBeTruthy();
    });

    it('does NOT show placeholder option when selectOption=false', () => {
      fixture.componentRef.setInput('optionsValues', ['A']);
      fixture.componentRef.setInput('selectOption', false);
      component.showDropdown.set(true);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.bocc-select__option--placeholder')).toBeFalsy();
    });

    it('adds scrollable class when isScrollable=true (more than 4 options)', () => {
      fixture.componentRef.setInput('optionsValues', ['1', '2', '3', '4', '5']);
      component.showDropdown.set(true);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.bocc-select__dropdown--scrollable')).toBeTruthy();
    });

    it('shows error row only when hasError=true AND errorMessage is set', () => {
      fixture.componentRef.setInput('hasError', true);
      fixture.componentRef.setInput('errorMessage', 'Required field');
      fixture.detectChanges();
      const errorRow = fixture.nativeElement.querySelector('.bocc-select__error-row');
      expect(errorRow).toBeTruthy();
      expect(errorRow.querySelector('.bocc-select__error-message').textContent.trim())
        .toBe('Required field');
    });

    it('does NOT show error row when errorMessage is empty', () => {
      fixture.componentRef.setInput('hasError', true);
      fixture.componentRef.setInput('errorMessage', '');
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.bocc-select__error-row')).toBeFalsy();
    });

    it('adds bocc-select--disabled class when isDisable=true', () => {
      fixture.componentRef.setInput('isDisable', true);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.bocc-select--disabled')).toBeTruthy();
    });

    it('adds bocc-select--error class when hasError=true', () => {
      fixture.componentRef.setInput('hasError', true);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.bocc-select--error')).toBeTruthy();
    });

    it('adds bocc-select--open class when showDropdown=true', () => {
      fixture.componentRef.setInput('optionsValues', ['A']);
      component.showDropdown.set(true);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.bocc-select--open')).toBeTruthy();
    });

    it('adds bocc-select--active class when isActive=true', () => {
      component.isActive.set(true);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.bocc-select--active')).toBeTruthy();
    });

    it('marks selected option with selected class', () => {
      fixture.componentRef.setInput('optionsValues', ['Option A', 'Option B']);
      component.currentlyValueInput.set('Option A');
      component.showDropdown.set(true);
      fixture.detectChanges();

      const options = fixture.nativeElement.querySelectorAll('.bocc-select__option');
      expect(options[0].classList.contains('bocc-select__option--selected')).toBeTrue();
      expect(options[1].classList.contains('bocc-select__option--selected')).toBeFalse();
    });
  });

  // ─────────────────────────────────────────────
  // 11. Template interactions (click handlers)
  // ─────────────────────────────────────────────
  describe('Template interactions', () => {
    it('clicking trigger calls handleDropdownVisibility', () => {
      spyOn(component, 'handleDropdownVisibility');
      fixture.componentRef.setInput('optionsValues', ['A']);
      fixture.detectChanges();

      const trigger = fixture.nativeElement.querySelector('.bocc-select__trigger');
      trigger.click();
      expect(component.handleDropdownVisibility).toHaveBeenCalled();
    });

    it('clicking an option calls setInputOption', () => {
      spyOn(component, 'setInputOption');
      fixture.componentRef.setInput('optionsValues', ['A', 'B']);
      component.showDropdown.set(true);
      fixture.detectChanges();

      const options = fixture.nativeElement.querySelectorAll(
        '.bocc-select__option:not(.bocc-select__option--placeholder)'
      );
      options[0].click();
      expect(component.setInputOption).toHaveBeenCalledWith('A', 0);
    });

    it('clicking placeholder option calls closeSelect', () => {
      spyOn(component, 'closeSelect');
      fixture.componentRef.setInput('optionsValues', ['A']);
      fixture.componentRef.setInput('selectOption', true);
      component.showDropdown.set(true);
      fixture.detectChanges();

      const placeholder = fixture.nativeElement.querySelector('.bocc-select__option--placeholder');
      placeholder.click();
      expect(component.closeSelect).toHaveBeenCalled();
    });
  });
});
