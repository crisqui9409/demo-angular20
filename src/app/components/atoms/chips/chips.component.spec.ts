import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChipsComponent } from './chips.component';
import { By } from '@angular/platform-browser';

describe('ChipsComponent', () => {
  let component: ChipsComponent;
  let fixture: ComponentFixture<ChipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChipsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChipsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('label', 'Test Chip');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the label', () => {
    const labelElement = fixture.debugElement.query(By.css('.bocc-chip-label')).nativeElement;
    expect(labelElement.textContent).toContain('Test Chip');
  });

  describe('Icons', () => {
    it('should not render an icon if icon input is not provided', () => {
      const iconElement = fixture.debugElement.query(By.css('.bocc-chip-icon'));
      expect(iconElement).toBeNull();
    });

    it('should render the correct Font Awesome icon classes', () => {
      fixture.componentRef.setInput('icon', 'user');
      fixture.detectChanges();

      const iconElement = fixture.debugElement.query(By.css('.bocc-chip-icon')).nativeElement;
      expect(iconElement.classList).toContain('fa-solid');
      expect(iconElement.classList).toContain('fa-user');
    });

    it('should apply correct font-size to icon based on chip size', () => {
      fixture.componentRef.setInput('icon', 'user');

      const sizes = [
        { size: 'xs', expected: '12px' },
        { size: 's', expected: '14px' },
        { size: 'm', expected: '16px' }
      ] as const;

      sizes.forEach(({ size, expected }) => {
        fixture.componentRef.setInput('size', size);
        fixture.detectChanges();
        const iconElement = fixture.debugElement.query(By.css('.bocc-chip-icon')).nativeElement;
        expect(iconElement.style.fontSize).toBe(expected);
      });
    });

    it('should render the xmark icon when removable is true', () => {
      fixture.componentRef.setInput('removable', true);
      fixture.detectChanges();

      const removeIcon = fixture.debugElement.query(By.css('.bocc-chip-remove i')).nativeElement;
      expect(removeIcon.classList).toContain('fa-solid');
      expect(removeIcon.classList).toContain('fa-xmark');
    });
  });

  describe('States and Sizes', () => {
    it('should apply the correct size class', () => {
      fixture.componentRef.setInput('size', 'xs');
      fixture.detectChanges();
      const chipElement = fixture.debugElement.query(By.css('.bocc-chip')).nativeElement;
      expect(chipElement.classList).toContain('bocc-chip--xs');
    });

    it('should apply the selected class when selected input is true', () => {
      fixture.componentRef.setInput('selected', true);
      fixture.detectChanges();
      const chipElement = fixture.debugElement.query(By.css('.bocc-chip')).nativeElement;
      expect(chipElement.classList).toContain('is-selected');
    });

    it('should apply the disabled class', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      const chipElement = fixture.debugElement.query(By.css('.bocc-chip')).nativeElement;
      expect(chipElement.classList).toContain('is-disabled');
    });
  });

  describe('Events', () => {
    it('should emit remove event when remove button is clicked', () => {
      const removeSpy = spyOn(component.remove, 'emit');
      fixture.componentRef.setInput('removable', true);
      fixture.detectChanges();

      const removeButton = fixture.debugElement.query(By.css('.bocc-chip-remove')).nativeElement;
      removeButton.click();

      expect(removeSpy).toHaveBeenCalled();
    });

    it('should not emit remove event when disabled', () => {
      const removeSpy = spyOn(component.remove, 'emit');
      fixture.componentRef.setInput('removable', true);
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const removeButton = fixture.debugElement.query(By.css('.bocc-chip-remove')).nativeElement;
      removeButton.click();

      expect(removeSpy).not.toHaveBeenCalled();
    });

    it('should stop event propagation on remove click', () => {
      fixture.componentRef.setInput('removable', true);
      fixture.detectChanges();

      const event = new MouseEvent('click');
      spyOn(event, 'stopPropagation');

      component.onRemove(event);
      expect(event.stopPropagation).toHaveBeenCalled();
    });
  });
});
