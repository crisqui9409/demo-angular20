import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChipsComponent } from './chips.component';

describe('ChipsComponent', () => {
  let component: ChipsComponent;
  let fixture: ComponentFixture<ChipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChipsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChipsComponent);
    component = fixture.componentInstance;
    // Set required input
    fixture.componentRef.setInput('label', 'Test Chip');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the label', () => {
    const labelElement: HTMLElement = fixture.nativeElement.querySelector('.bocc-chip-label');
    expect(labelElement.textContent).toContain('Test Chip');
  });

  it('should emit remove event when remove button is clicked', () => {
    spyOn(component.remove, 'emit');
    fixture.componentRef.setInput('removable', true);
    fixture.detectChanges();

    const removeButton: HTMLElement = fixture.nativeElement.querySelector('.bocc-chip-remove');
    removeButton.click();

    expect(component.remove.emit).toHaveBeenCalled();
  });

  it('should apply the correct size class', () => {
    fixture.componentRef.setInput('size', 'xs');
    fixture.detectChanges();
    const chipElement: HTMLElement = fixture.nativeElement.querySelector('.bocc-chip');
    expect(chipElement.classList).toContain('bocc-chip--xs');
  });

  it('should apply the selected class when selected input is true', () => {
    fixture.componentRef.setInput('selected', true);
    fixture.detectChanges();
    const chipElement: HTMLElement = fixture.nativeElement.querySelector('.bocc-chip');
    expect(chipElement.classList).toContain('is-selected');
  });

  it('should apply the disabled class and disable the remove button', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.componentRef.setInput('removable', true);
    fixture.detectChanges();
    
    const chipElement: HTMLElement = fixture.nativeElement.querySelector('.bocc-chip');
    const removeButton: HTMLButtonElement = fixture.nativeElement.querySelector('.bocc-chip-remove');
    
    expect(chipElement.classList).toContain('is-disabled');
    expect(removeButton.disabled).toBeTrue();
  });

  it('should not emit remove event when disabled', () => {
    spyOn(component.remove, 'emit');
    fixture.componentRef.setInput('removable', true);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const removeButton: HTMLElement = fixture.nativeElement.querySelector('.bocc-chip-remove');
    removeButton.click();

    expect(component.remove.emit).not.toHaveBeenCalled();
  });
});
