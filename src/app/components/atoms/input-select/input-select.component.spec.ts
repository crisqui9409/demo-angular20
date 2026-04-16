import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputSelectComponent } from './input-select.component';
import { SelectCoordinatorService } from '../../../services/select-coordinator.service';
import { BehaviorSubject } from 'rxjs';

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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization and Inputs (Full Branches)', () => {
    it('ngOnInit: fallback values for placeholder', () => {
      fixture.componentRef.setInput('placeholder', 'Val');
      component.ngOnInit();
      expect(component.currentlyValueInput()).toBe('Val');

      fixture.componentRef.setInput('placeholder', '');
      component.ngOnInit();
      expect(component.currentlyValueInput()).toBe('Selecciona');
      
      fixture.componentRef.setInput('placeholder', null);
      component.ngOnInit();
      expect(component.currentlyValueInput()).toBe('Selecciona');
    });

    it('ngOnInit: pre-selection boundary cases', () => {
      fixture.componentRef.setInput('optionsValues', ['A', 'B']);
      
      fixture.componentRef.setInput('activeOption', -1);
      component.ngOnInit();
      expect(component.isActive()).toBeFalse();

      fixture.componentRef.setInput('activeOption', 2);
      component.ngOnInit();
      expect(component.isActive()).toBeFalse();

      fixture.componentRef.setInput('activeOption', 10);
      component.ngOnInit();
      expect(component.isActive()).toBeFalse();

      fixture.componentRef.setInput('activeOption', 1);
      component.ngOnInit();
      expect(component.isActive()).toBeTrue();
      expect(component.currentlyValueInput()).toBe('B');
    });

    it('effect: should react to returnToDefault', () => {
      fixture.componentRef.setInput('placeholder', 'Reset');
      component.isActive.set(true);
      component.currentlyValueInput.set('Old');
      
      fixture.componentRef.setInput('returnToDefault', true);
      fixture.detectChanges();

      expect(component.isActive()).toBeFalse();
      expect(component.currentlyValueInput()).toBe('Reset');
      
      fixture.componentRef.setInput('returnToDefault', false);
      fixture.detectChanges();
      expect(component.isActive()).toBeFalse();
    });
  });

  describe('Dropdown Visibility and Coordination', () => {
    it('handleDropdownVisibility: return branches (isDisable || !hasOptions)', () => {
      fixture.componentRef.setInput('isDisable', true);
      fixture.componentRef.setInput('optionsValues', ['A']);
      fixture.detectChanges();
      component.handleDropdownVisibility();
      expect(component.showDropdown()).toBeFalse();

      fixture.componentRef.setInput('isDisable', false);
      fixture.componentRef.setInput('optionsValues', []);
      fixture.detectChanges();
      component.handleDropdownVisibility();
      expect(component.showDropdown()).toBeFalse();
    });

    it('handleDropdownVisibility: toggle and coordinator calls', () => {
      fixture.componentRef.setInput('optionsValues', ['A']);
      fixture.detectChanges();

      component.handleDropdownVisibility();
      expect(component.showDropdown()).toBeTrue();
      expect(coordinatorSpy.openSelect).toHaveBeenCalled();

      component.handleDropdownVisibility();
      expect(component.showDropdown()).toBeFalse();
      expect(coordinatorSpy.closeAllSelects).toHaveBeenCalled();
    });

    it('coordinator subscription: branches for openId', () => {
      component.showDropdown.set(true);
      const myId = (component as any).id;
      
      coordinatorSpy._subject.next(myId);
      expect(component.showDropdown()).toBeTrue();

      coordinatorSpy._subject.next('other');
      expect(component.showDropdown()).toBeFalse();
      
      component.showDropdown.set(true);
      coordinatorSpy._subject.next(null);
      expect(component.showDropdown()).toBeFalse();
    });
  });

  describe('Host and Document Listeners', () => {
    it('onFocusOut: boundary cases for relatedTarget', () => {
      component.showDropdown.set(true);
      
      component.onFocusOut(new FocusEvent('focusout', { relatedTarget: null }));
      expect(component.showDropdown()).toBeFalse();

      component.showDropdown.set(true);
      const div = document.createElement('div');
      component.onFocusOut(new FocusEvent('focusout', { relatedTarget: div }));
      expect(component.showDropdown()).toBeFalse();

      component.showDropdown.set(true);
      const inner = fixture.nativeElement.querySelector('.bocc-select');
      component.onFocusOut(new FocusEvent('focusout', { relatedTarget: inner }));
      expect(component.showDropdown()).toBeTrue();
    });

    it('onHostClick: should stop propagation', () => {
      const event = new MouseEvent('click');
      spyOn(event, 'stopPropagation');
      component.onHostClick(event);
      expect(event.stopPropagation).toHaveBeenCalled();
    });

    it('onDocumentClick: should close', () => {
      component.showDropdown.set(true);
      component.onDocumentClick();
      expect(component.showDropdown()).toBeFalse();
    });
  });

  describe('Methods and Template', () => {
    it('setInputOption: should select and close', () => {
      spyOn(component.handleInput, 'emit');
      component.setInputOption('Option', 1);
      expect(component.currentlyValueInput()).toBe('Option');
      expect(component.showDropdown()).toBeFalse();
      expect(component.handleInput.emit).toHaveBeenCalled();
    });

    it('closeSelect: should close dropdown', () => {
      component.showDropdown.set(true);
      component.closeSelect();
      expect(component.showDropdown()).toBeFalse();
    });

    it('Template: selectOption branch', () => {
      fixture.componentRef.setInput('selectOption', true);
      component.showDropdown.set(true);
      fixture.detectChanges();
      const placeholderOpt = fixture.nativeElement.querySelector('.bocc-select__option--placeholder');
      expect(placeholderOpt).toBeTruthy();

      placeholderOpt.click();
      expect(component.showDropdown()).toBeFalse();
    });

    it('Template: keyup events', () => {
      fixture.componentRef.setInput('optionsValues', ['A']);
      fixture.detectChanges();
      const trigger = fixture.nativeElement.querySelector('.bocc-select__trigger');

      trigger.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
      expect(component.showDropdown()).toBeTrue();

      trigger.dispatchEvent(new KeyboardEvent('keyup', { key: ' ' }));
      expect(component.showDropdown()).toBeFalse();
    });

    it('HostListener: touchstart should stop propagation', () => {
      const event = new TouchEvent('touchstart');
      spyOn(event, 'stopPropagation');
      component.onHostClick(event);
      expect(event.stopPropagation).toHaveBeenCalled();
    });

    it('Template: error branches (hasError && errorMessage)', () => {
      fixture.componentRef.setInput('hasError', true);
      fixture.componentRef.setInput('errorMessage', '');
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.bocc-select__error-row')).toBeFalsy();

      fixture.componentRef.setInput('errorMessage', 'Err');
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.bocc-select__error-row')).toBeTruthy();
    });

    it('Lifecycle: onDestroy should unsubscribe', () => {
      const subSpy = jasmine.createSpyObj('Subscription', ['unsubscribe']);
      spyOn(coordinatorSpy.selectOpen$, 'subscribe').and.returnValue(subSpy);
      
      // Re-crear el componente para disparar el constructor con el spy
      const newFixture = TestBed.createComponent(InputSelectComponent);
      newFixture.destroy();
      
      expect(subSpy.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('Template – ramas faltantes (cobertura 100%)', () => {

    it('dropdown con >4 opciones debe tener clase --scrollable', () => {
      fixture.componentRef.setInput(
        'optionsValues', ['A', 'B', 'C', 'D', 'E']  
      );
      component.showDropdown.set(true);
      fixture.detectChanges();

      const dropdown = fixture.nativeElement.querySelector('.bocc-select__dropdown');
      expect(dropdown).toBeTruthy();
      expect(dropdown.classList).toContain('bocc-select__dropdown--scrollable');
    });

    it('la opción activa debe tener clase --selected en el DOM', () => {
      fixture.componentRef.setInput('optionsValues', ['X', 'Y', 'Z']);
      component.showDropdown.set(true);
      fixture.detectChanges();

      component.setInputOption('Y', 1);
      component.showDropdown.set(true);   
      fixture.detectChanges();

      const items = fixture.nativeElement
        .querySelectorAll('.bocc-select__option:not(.bocc-select__option--placeholder)');

      expect(items[1].classList).toContain('bocc-select__option--selected'); 
      expect(items[0].classList).not.toContain('bocc-select__option--selected');
      expect(items[2].classList).not.toContain('bocc-select__option--selected');
    });


    it('keydown.enter sobre una opción llama a setInputOption', () => {
      fixture.componentRef.setInput('optionsValues', ['Alpha', 'Beta']);
      component.showDropdown.set(true);
      fixture.detectChanges();

      spyOn(component, 'setInputOption').and.callThrough();

      const options = fixture.nativeElement
        .querySelectorAll('.bocc-select__option:not(.bocc-select__option--placeholder)');

      options[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      fixture.detectChanges();

      expect(component.setInputOption).toHaveBeenCalledWith('Alpha', 0);
      expect(component.currentlyValueInput()).toBe('Alpha');
    });

    it('keydown.enter sobre el placeholder llama a closeSelect', () => {
      fixture.componentRef.setInput('selectOption', true);
      fixture.componentRef.setInput('optionsValues', ['A']);
      component.showDropdown.set(true);
      fixture.detectChanges();

      spyOn(component, 'closeSelect').and.callThrough();

      const placeholder = fixture.nativeElement
        .querySelector('.bocc-select__option--placeholder');

      expect(placeholder).toBeTruthy();
      placeholder.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      fixture.detectChanges();

      expect(component.closeSelect).toHaveBeenCalled();
      expect(component.showDropdown()).toBeFalse();
    });

    it('setInputOption debe emitir también por onSelectOption con value e index', () => {
      spyOn(component.onSelectOption, 'emit');

      component.setInputOption('Omega', 3);

      expect(component.onSelectOption.emit).toHaveBeenCalledWith({ value: 'Omega', index: 3 });
    });
  });

  describe('Ramas de template sin cubrir – cobertura real', () => {

    it('dropdown con 5+ opciones aplica clase --scrollable', () => {
      fixture.componentRef.setInput('optionsValues', ['A','B','C','D','E']);
      fixture.detectChanges();
      component.showDropdown.set(true);
      fixture.detectChanges();

      const dropdown = fixture.nativeElement
        .querySelector('.bocc-select__dropdown');
      expect(dropdown.classList)
        .toContain('bocc-select__dropdown--scrollable');
    });

    it('opción preseleccionada tiene clase --selected y aria-selected="true"', () => {
      fixture.componentRef.setInput('optionsValues', ['Uno','Dos','Tres']);
      fixture.componentRef.setInput('activeOption', 1); // preselecciona 'Dos'
      component.ngOnInit();
      fixture.detectChanges();

      component.showDropdown.set(true);
      fixture.detectChanges();

      const items = fixture.nativeElement
        .querySelectorAll('.bocc-select__option:not(.bocc-select__option--placeholder)');

      expect(items[1].classList).toContain('bocc-select__option--selected');
      expect(items[1].getAttribute('aria-selected')).toBe('true');

      expect(items[0].classList).not.toContain('bocc-select__option--selected');
      expect(items[0].getAttribute('aria-selected')).toBe('false');
    });

    it('setInputOption marca la opción como selected en el DOM al reabrir', () => {
      fixture.componentRef.setInput('optionsValues', ['X','Y','Z']);
      fixture.detectChanges();

      component.setInputOption('Y', 1);

      component.showDropdown.set(true);
      fixture.detectChanges();

      const items = fixture.nativeElement
        .querySelectorAll('.bocc-select__option');

      expect(items[1].classList).toContain('bocc-select__option--selected');
      expect(items[1].getAttribute('aria-selected')).toBe('true');
      expect(items[0].classList).not.toContain('bocc-select__option--selected');
    });
  });
});
