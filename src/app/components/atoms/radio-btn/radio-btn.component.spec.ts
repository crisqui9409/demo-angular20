import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RadioBtnComponent } from './radio-btn.component';
import { By } from '@angular/platform-browser';

describe('RadioBtnComponent', () => {
  let component: RadioBtnComponent;
  let fixture: ComponentFixture<RadioBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioBtnComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RadioBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Verify component creation
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Verify input signal bindings
  it('should bind inputs correctly', () => {
    fixture.componentRef.setInput('name', 'test-radio');
    fixture.componentRef.setInput('value', '1');
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    expect(input.name).toBe('test-radio');
    expect(input.value).toBe('1');
  });

  // Verify checked state
  it('should reflect checked state', () => {
    fixture.componentRef.setInput('checked', true);
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    expect(input.checked).toBeTrue();
  });

  // Verify disabled state
  it('should handle disabled state', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    const label = fixture.debugElement.query(By.css('label')).nativeElement as HTMLLabelElement;

    expect(input.disabled).toBeTrue();
    expect(label.classList.contains('disabled')).toBeTrue();
  });

  // Verify change emission
  it('should emit radioChange on selection', () => {
    spyOn(component.radioChange, 'emit');
    const inputDebug = fixture.debugElement.query(By.css('input'));

    inputDebug.nativeElement.checked = true;
    inputDebug.triggerEventHandler('change', { target: inputDebug.nativeElement });

    expect(component.radioChange.emit).toHaveBeenCalledWith(true);
  });

  // Verify side text rendering
  it('should display side text label', () => {
    fixture.componentRef.setInput('sideText', 'Radio Label');
    fixture.componentRef.setInput('showSideText', true);
    fixture.detectChanges();

    const p = fixture.debugElement.query(By.css('.side-text'));
    expect(p.nativeElement.textContent).toContain('Radio Label');
  });
});
