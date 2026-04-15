import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputSelectTableComponent } from './input-select-table.component';

describe('InputSelectTableComponent', () => {
  let component: InputSelectTableComponent;
  let fixture: ComponentFixture<InputSelectTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputSelectTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InputSelectTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle dropdown when clicking the trigger', () => {
    const trigger: HTMLElement = fixture.nativeElement.querySelector('.bocc-select-trigger');

    // Abrir
    trigger.click();
    fixture.detectChanges();
    expect(component.isOpen()).toBeTrue();
    expect(fixture.nativeElement.querySelector('.bocc-select-options')).toBeTruthy();

    trigger.click();
    fixture.detectChanges();
    expect(component.isOpen()).toBeFalse();
    expect(fixture.nativeElement.querySelector('.bocc-select-options')).toBeFalsy();
  });

  it('should select an option and emit sizeChange', () => {
    spyOn(component.sizeChange, 'emit');

    const trigger: HTMLElement = fixture.nativeElement.querySelector('.bocc-select-trigger');
    trigger.click();
    fixture.detectChanges();

    const options: HTMLElement[] = fixture.nativeElement.querySelectorAll('.bocc-select-option');
    options[1].click();
    fixture.detectChanges();

    expect(component.currentValue()).toBe(20);
    expect(component.sizeChange.emit).toHaveBeenCalledWith(20);
    expect(component.isOpen()).toBeFalse();
  });

  it('should show the initial value correctly', () => {
    const triggerText: string = fixture.nativeElement.querySelector('.bocc-select-trigger span').textContent;
    expect(triggerText.trim()).toBe('10');
  });

  it('should close dropdown when clicking outside', () => {
    component.isOpen.set(true);
    fixture.detectChanges();

    document.dispatchEvent(new MouseEvent('click'));
    fixture.detectChanges();

    expect(component.isOpen()).toBeFalse();
  });
});
