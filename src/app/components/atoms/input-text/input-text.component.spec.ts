import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { InputTextComponent } from './input-text.component';
import { FormsModule } from '@angular/forms';

describe('InputTextComponent', () => {
  let component: InputTextComponent;
  let fixture: ComponentFixture<InputTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputTextComponent, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(InputTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ─────────────────────────────────────────────
  // 1. Creación e inicialización
  // ─────────────────────────────────────────────
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Default values', () => {
    it('should have correct default inputs and signals', () => {
      expect(component.title()).toBe('');
      expect(component.maxLength()).toBe(40);
      expect(component.minLength()).toBe(0);
      expect(component.isDisable()).toBeFalse();
      expect(component.type()).toBe('text');
      expect(component.isRequired()).toBeFalse();
      expect(component.autocomplete()).toBe('off');
      expect(component.inputmode()).toBe('text');
      expect(component.allowCopy()).toBeTrue();
      expect(component.allowCut()).toBeTrue();
      expect(component.allowPaste()).toBeTrue();
      expect(component.allowDrop()).toBeTrue();
      expect(component.allowWheel()).toBeFalse();
      expect(component.showError()).toBeFalse();
      expect(component.isFocused()).toBeFalse();
      expect(component.valueInput()).toBe('');
    });
  });

  // ─────────────────────────────────────────────
  // 2. showError Computed (todas las ramas del ||)
  // ─────────────────────────────────────────────
  describe('showError computed (branches)', () => {
    it('false when both hasError=false and validationError=false', () => {
      fixture.componentRef.setInput('hasError', false);
      component.clearInput();
      expect(component.showError()).toBeFalse();
    });

    it('true when only hasError=true', () => {
      fixture.componentRef.setInput('hasError', true);
      expect(component.showError()).toBeTrue();
    });

    it('true when only validationError=true (minLength fails)', () => {
      fixture.componentRef.setInput('hasError', false);
      fixture.componentRef.setInput('minLength', 5);
      component.onInput({ target: { value: 'ab' } } as any);
      expect(component.showError()).toBeTrue();
    });

    it('true when both hasError=true and validationError=true', () => {
      fixture.componentRef.setInput('hasError', true);
      fixture.componentRef.setInput('minLength', 5);
      component.onInput({ target: { value: 'ab' } } as any);
      expect(component.showError()).toBeTrue();
    });
  });

  // ─────────────────────────────────────────────
  // 3. onFocus & onBlur
  // ─────────────────────────────────────────────
  describe('Focus / Blur', () => {
    it('onFocus() sets isFocused=true', () => {
      component.onFocus(new Event('focus'));
      expect(component.isFocused()).toBeTrue();
    });

    it('onBlur() clears isFocused and emits handleOnBlur after 200ms', fakeAsync(() => {
      spyOn(component.handleOnBlur, 'emit');
      component.isFocused.set(true);
      component.onBlur(new Event('blur'));
      expect(component.isFocused()).toBeTrue();
      tick(200);
      expect(component.isFocused()).toBeFalse();
      expect(component.handleOnBlur.emit).toHaveBeenCalledWith('');
    }));
  });

  // ─────────────────────────────────────────────
  // 4. onInput — validaciones
  // ─────────────────────────────────────────────
  describe('onInput (branches)', () => {
    it('pattern passes AND minLength met → no error', () => {
      fixture.componentRef.setInput('pattern', /^[a-z]+$/);
      fixture.componentRef.setInput('minLength', 2);
      component.onInput({ target: { value: 'abc' } } as any);
      expect(component.showError()).toBeFalse();
      expect(component.valueInput()).toBe('abc');
    });

    it('pattern fails → error', () => {
      fixture.componentRef.setInput('pattern', /^[a-z]+$/);
      component.onInput({ target: { value: '123' } } as any);
      expect(component.showError()).toBeTrue();
    });

    it('minLength not met → error', () => {
      fixture.componentRef.setInput('minLength', 5);
      component.onInput({ target: { value: 'hi' } } as any);
      expect(component.showError()).toBeTrue();
    });

    it('emits handleInput on every keystroke', () => {
      spyOn(component.handleInput, 'emit');
      component.onInput({ target: { value: 'test' } } as any);
      expect(component.handleInput.emit).toHaveBeenCalledWith('test');
    });
  });

  // ─────────────────────────────────────────────
  // 5. onPaste (allowPaste + clipboardData nullish)
  // ─────────────────────────────────────────────
  describe('onPaste (branches)', () => {
    it('does NOT call manageCopyDropText when allowPaste=false', () => {
      fixture.componentRef.setInput('allowPaste', false);
      spyOn(component, 'manageCopyDropText');
      component.onPaste(new Event('paste'));
      expect(component.manageCopyDropText).not.toHaveBeenCalled();
    });

    it('calls manageCopyDropText with empty string when clipboardData is null', () => {
      fixture.componentRef.setInput('allowPaste', true);
      spyOn(component, 'manageCopyDropText').and.callThrough();
      const el = { value: '', selectionStart: 0, selectionEnd: 0, setSelectionRange: () => {} };
      const event = new Event('paste') as any;
      Object.defineProperty(event, 'target', { value: el });
      component.onPaste(event);
      expect(component.manageCopyDropText).toHaveBeenCalledWith('', event);
    });

    it('calls manageCopyDropText with text when clipboardData exists', () => {
      fixture.componentRef.setInput('allowPaste', true);
      spyOn(component, 'manageCopyDropText').and.callThrough();
      const el = { value: '', selectionStart: 0, selectionEnd: 0, setSelectionRange: () => {} };
      const dt = new DataTransfer();
      dt.setData('text', 'pasted text');
      const event = new ClipboardEvent('paste', { clipboardData: dt, cancelable: true });
      Object.defineProperty(event, 'target', { value: el });
      component.onPaste(event);
      expect(component.manageCopyDropText).toHaveBeenCalledWith('pasted text', event);
    });
  });

  // ─────────────────────────────────────────────
  // 6. onDrop (allowDrop + dataTransfer nullish)
  // ─────────────────────────────────────────────
  describe('onDrop (branches)', () => {
    it('does NOT call manageCopyDropText when allowDrop=false', () => {
      fixture.componentRef.setInput('allowDrop', false);
      spyOn(component, 'manageCopyDropText');
      component.onDrop(new Event('drop'));
      expect(component.manageCopyDropText).not.toHaveBeenCalled();
    });

    it('calls manageCopyDropText with empty string when dataTransfer is null', () => {
      fixture.componentRef.setInput('allowDrop', true);
      spyOn(component, 'manageCopyDropText').and.callThrough();
      const el = { value: '', selectionStart: 0, selectionEnd: 0, setSelectionRange: () => {} };
      const event = new Event('drop') as any;
      Object.defineProperty(event, 'target', { value: el });
      component.onDrop(event);
      expect(component.manageCopyDropText).toHaveBeenCalledWith('', event);
    });

    it('calls manageCopyDropText with data when dataTransfer has text', () => {
      fixture.componentRef.setInput('allowDrop', true);
      spyOn(component, 'manageCopyDropText').and.callThrough();
      const el = { value: '', selectionStart: 0, selectionEnd: 0, setSelectionRange: () => {} };
      const dt = new DataTransfer();
      dt.setData('text', 'dropped text');
      const event = new DragEvent('drop', { dataTransfer: dt, cancelable: true });
      Object.defineProperty(event, 'target', { value: el });
      component.onDrop(event);
      expect(component.manageCopyDropText).toHaveBeenCalledWith('dropped text', event);
    });
  });

  // ─────────────────────────────────────────────
  // 7. manageCopyDropText — todas las ramas
  // ─────────────────────────────────────────────
  describe('manageCopyDropText (branches)', () => {
    let mockTarget: any;

    beforeEach(() => {
      mockTarget = {
        value: 'hello',
        selectionStart: 5,
        selectionEnd: 5,
        setSelectionRange: jasmine.createSpy('setSelectionRange')
      };
    });

    it('text matches pattern — no sanitization', () => {
      fixture.componentRef.setInput('pattern', /^[a-z ]+$/);
      component.manageCopyDropText('world', { target: mockTarget } as any);
      expect(mockTarget.value).toBe('helloworld');
    });

    it('text does NOT match pattern — strips invalid chars', () => {
      fixture.componentRef.setInput('pattern', /^[a-z]+$/);
      component.manageCopyDropText('abc123', { target: mockTarget } as any);
      expect(mockTarget.value).toBe('helloabc');
    });

    it('selectionStart/End are null → fallback to 0', () => {
      mockTarget.selectionStart = null;
      mockTarget.selectionEnd = null;
      component.manageCopyDropText('new', { target: mockTarget } as any);
      expect(mockTarget.value).toBe('newhello');
    });

    it('value.length + text.length > maxLength → truncates', () => {
      fixture.componentRef.setInput('maxLength', 7);
      mockTarget.value = 'hello';
      mockTarget.selectionStart = 5;
      mockTarget.selectionEnd = 5;
      component.manageCopyDropText('worldx', { target: mockTarget } as any);
      expect(mockTarget.value).toBe('hellowo');
    });

    it('value.length + text.length <= maxLength → no truncation', () => {
      fixture.componentRef.setInput('maxLength', 20);
      mockTarget.value = 'hi';
      mockTarget.selectionStart = 2;
      mockTarget.selectionEnd = 2;
      component.manageCopyDropText('abc', { target: mockTarget } as any);
      expect(mockTarget.value).toBe('hiabc');
    });

    it('emits handleInput with new value', () => {
      spyOn(component.handleInput, 'emit');
      component.manageCopyDropText('!', { target: mockTarget } as any);
      expect(component.handleInput.emit).toHaveBeenCalled();
    });
  });

  // ─────────────────────────────────────────────
  // 8. onWheel, onCopy, onCut
  // ─────────────────────────────────────────────
  describe('onWheel (branches)', () => {
    it('calls preventDefault when allowWheel=false', () => {
      fixture.componentRef.setInput('allowWheel', false);
      const ev = new Event('wheel', { cancelable: true });
      spyOn(ev, 'preventDefault');
      component.onWheel(ev);
      expect(ev.preventDefault).toHaveBeenCalled();
    });

    it('does NOT call preventDefault when allowWheel=true', () => {
      fixture.componentRef.setInput('allowWheel', true);
      const ev = new Event('wheel', { cancelable: true });
      spyOn(ev, 'preventDefault');
      component.onWheel(ev);
      expect(ev.preventDefault).not.toHaveBeenCalled();
    });
  });

  describe('onCopy (branches)', () => {
    it('calls preventDefault when allowCopy=false', () => {
      fixture.componentRef.setInput('allowCopy', false);
      const ev = new Event('copy', { cancelable: true });
      spyOn(ev, 'preventDefault');
      component.onCopy(ev);
      expect(ev.preventDefault).toHaveBeenCalled();
    });

    it('emits handleInput when allowCopy=true', () => {
      fixture.componentRef.setInput('allowCopy', true);
      spyOn(component.handleInput, 'emit');
      component.onCopy(new Event('copy'));
      expect(component.handleInput.emit).toHaveBeenCalled();
    });
  });

  describe('onCut (branches)', () => {
    it('calls preventDefault when allowCut=false', () => {
      fixture.componentRef.setInput('allowCut', false);
      const ev = new Event('cut', { cancelable: true });
      spyOn(ev, 'preventDefault');
      component.onCut(ev);
      expect(ev.preventDefault).toHaveBeenCalled();
    });

    it('emits handleInput when allowCut=true', () => {
      fixture.componentRef.setInput('allowCut', true);
      spyOn(component.handleInput, 'emit');
      component.onCut(new Event('cut'));
      expect(component.handleInput.emit).toHaveBeenCalled();
    });
  });

  // ─────────────────────────────────────────────
  // 9. Key events
  // ─────────────────────────────────────────────
  describe('Key events', () => {
    it('onkeypress emits handleKeydown=true', () => {
      spyOn(component.handleKeydown, 'emit');
      component.onkeypress();
      expect(component.handleKeydown.emit).toHaveBeenCalledWith(true);
    });

    it('onKeydown emits handleKeydown=true', () => {
      spyOn(component.handleKeydown, 'emit');
      component.onKeydown();
      expect(component.handleKeydown.emit).toHaveBeenCalledWith(true);
    });
  });

  // ─────────────────────────────────────────────
  // 10. clearInput — Public API
  // ─────────────────────────────────────────────
  describe('clearInput (public API)', () => {
    it('resets valueInput and clears validation error', () => {
      fixture.componentRef.setInput('minLength', 5);
      component.onInput({ target: { value: 'hi' } } as any);
      expect(component.showError()).toBeTrue();
      component.clearInput();
      expect(component.valueInput()).toBe('');
      expect(component.showError()).toBeFalse();
    });
  });

  // ─────────────────────────────────────────────
  // 11. Template rendering — ramas @if del HTML
  // ─────────────────────────────────────────────
  describe('Template rendering', () => {
    it('shows error message when showError=true AND errorMessage is set', () => {
      fixture.componentRef.setInput('hasError', true);
      fixture.componentRef.setInput('errorMessage', 'Campo obligatorio');
      fixture.detectChanges();
      const msg = fixture.nativeElement.querySelector('.error-message');
      expect(msg).toBeTruthy();
      expect(msg.textContent.trim()).toBe('Campo obligatorio');
    });

    it('does NOT show error row when showError=true but errorMessage is empty', () => {
      fixture.componentRef.setInput('hasError', true);
      fixture.componentRef.setInput('errorMessage', '');
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.error-row')).toBeFalsy();
    });

    it('adds is-disabled class when isDisable=true', () => {
      fixture.componentRef.setInput('isDisable', true);
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector('.input-container').classList.contains('is-disabled')
      ).toBeTrue();
    });

    it('adds is-focused class when isFocused=true', () => {
      component.isFocused.set(true);
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector('.input-container').classList.contains('is-focused')
      ).toBeTrue();
    });

    it('adds is-filled class when valueInput has content', () => {
      component.valueInput.set('something');
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector('.input-container').classList.contains('is-filled')
      ).toBeTrue();
    });

    it('adds is-error class when showError=true', () => {
      fixture.componentRef.setInput('hasError', true);
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector('.input-container').classList.contains('is-error')
      ).toBeTrue();
    });
  });
});
