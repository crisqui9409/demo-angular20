import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChipsComponent } from './chips.component';
import { By } from '@angular/platform-browser';
import { MasterIconComponent } from '../../atoms/master-icon/master-icon.component';

describe('ChipsComponent', () => {
  let component: ChipsComponent;
  let fixture: ComponentFixture<ChipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChipsComponent, MasterIconComponent],
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
    it('should not render a master icon if icon input is not provided', () => {
      const iconElement = fixture.debugElement.query(By.css('bocc-master-icon:not(.bocc-chip-remove bocc-master-icon)'));
      expect(iconElement).toBeNull();
    });

    it('should render bocc-master-icon with correct name when provided', () => {
      fixture.componentRef.setInput('icon', 'burger');
      fixture.detectChanges();

      const iconElement = fixture.debugElement.query(By.css('.bocc-chip-icon'));
      expect(iconElement).toBeTruthy();
      expect(iconElement.componentInstance.name()).toBe('burger');
    });

    it('should apply brand color to icon if not disabled', () => {
      fixture.componentRef.setInput('icon', 'burger');
      fixture.detectChanges();

      const iconElement = fixture.debugElement.query(By.css('.bocc-chip-icon'));
      expect(iconElement.componentInstance.color()).toBe('brand');
    });

    it('should render the close icon when removable is true', () => {
      fixture.componentRef.setInput('removable', true);
      fixture.detectChanges();

      const removeIcon = fixture.debugElement.query(By.css('.bocc-chip-remove bocc-master-icon'));
      expect(removeIcon).toBeTruthy();
      expect(removeIcon.componentInstance.name()).toBe('close');
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

    it('should apply disable color to icons when disabled', () => {
      fixture.componentRef.setInput('icon', 'burger');
      fixture.componentRef.setInput('disabled', true);
      fixture.componentRef.setInput('removable', true);
      fixture.detectChanges();
      
      const icons = fixture.debugElement.queryAll(By.css('bocc-master-icon'));
      icons.forEach(icon => {
        expect(icon.componentInstance.color()).toBe('disable');
      });
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
  });
});
