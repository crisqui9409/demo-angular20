import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckboxBtnComponent } from './checkbox-btn.component';
import { By } from '@angular/platform-browser';

describe('CheckboxBtnComponent', () => {
  let component: CheckboxBtnComponent;
  let fixture: ComponentFixture<CheckboxBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxBtnComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckboxBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Check if the component instance is created successfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Verify that input signals correctly bind to the native HTML input attributes
  it('should bind inputs correctly to the native element', () => {
    fixture.componentRef.setInput('name', 'my-check');
    fixture.componentRef.setInput('value', 'val123');
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    expect(input.id).toBe('my-check');
    expect(input.name).toBe('my-check');
    expect(input.value).toBe('val123');
  });

  // Ensure the checked property changes reflect in the DOM element
  it('should update checked state correctly', () => {
    fixture.componentRef.setInput('checked', true);
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    expect(input.checked).toBeTrue();
  });

  // Test if the disabled state properly disables the input and applies CSS classes
  it('should handle disabled state', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    const label = fixture.debugElement.query(By.css('label')).nativeElement as HTMLLabelElement;

    expect(input.disabled).toBeTrue();
    expect(label.classList.contains('disabled')).toBeTrue();
  });

  // Validate that the indeterminate signal synchronizes with the native DOM property via effect
  it('should set indeterminate property via effect', () => {
    fixture.componentRef.setInput('indeterminate', true);
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    expect(input.indeterminate).toBeTrue();
  });

  // Confirm that the output emits the new boolean value when the input changes
  it('should emit checkboxChange on input change', () => {
    spyOn(component.checkboxChange, 'emit');
    const inputDebug = fixture.debugElement.query(By.css('input'));

    inputDebug.nativeElement.checked = true;
    inputDebug.triggerEventHandler('change', { target: inputDebug.nativeElement });

    expect(component.checkboxChange.emit).toHaveBeenCalledWith(true);
  });

  // Check conditional rendering and text content of the sideText signal
  it('should display sideText conditionally', () => {
    fixture.componentRef.setInput('sideText', 'Legal notice');
    fixture.componentRef.setInput('showSideText', true);
    fixture.detectChanges();

    let textNode = fixture.debugElement.query(By.css('.side-text'));
    expect(textNode.nativeElement.textContent).toContain('Legal notice');

    fixture.componentRef.setInput('showSideText', false);
    fixture.detectChanges();

    textNode = fixture.debugElement.query(By.css('.side-text'));
    expect(textNode).toBeNull();
  });
});
