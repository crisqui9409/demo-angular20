import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MasterIconComponent } from './master-icon.component';
import { By } from '@angular/platform-browser';

describe('MasterIconComponent', () => {
  let component: MasterIconComponent;
  let fixture: ComponentFixture<MasterIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasterIconComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MasterIconComponent);
    component = fixture.componentInstance;
    // Set mandatory icon name for creation
    fixture.componentRef.setInput('name', 'burger');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate the correct icon path', () => {
    fixture.componentRef.setInput('name', 'calendar');
    fixture.detectChanges();
    
    expect(component.iconPath()).toBe('assets/icons/calendar.svg');
    
    const iconElement = fixture.debugElement.query(By.css('.bocc-master-icon')).nativeElement;
    // Check that mask-image or the custom property includes the correct path
    expect(iconElement.style.getPropertyValue('--icon-path')).toContain('assets/icons/calendar.svg');
  });

  it('should apply the correct size', () => {
    const customSize = '48px';
    fixture.componentRef.setInput('size', customSize);
    fixture.detectChanges();

    const iconElement = fixture.debugElement.query(By.css('.bocc-master-icon')).nativeElement;
    expect(iconElement.style.width).toBe(customSize);
    expect(iconElement.style.height).toBe(customSize);
  });

  it('should apply the correct color theme class for brand', () => {
    fixture.componentRef.setInput('color', 'brand');
    fixture.detectChanges();

    const iconElement = fixture.debugElement.query(By.css('.bocc-master-icon')).nativeElement;
    expect(iconElement.classList).toContain('bocc-master-icon--brand');
  });

  it('should apply the correct color theme class for disable', () => {
    fixture.componentRef.setInput('color', 'disable');
    fixture.detectChanges();

    const iconElement = fixture.debugElement.query(By.css('.bocc-master-icon')).nativeElement;
    expect(iconElement.classList).toContain('bocc-master-icon--disable');
  });

  it('should apply the default color theme class', () => {
    // Already set to default in init, but let's be explicit
    fixture.componentRef.setInput('color', 'default');
    fixture.detectChanges();

    const iconElement = fixture.debugElement.query(By.css('.bocc-master-icon')).nativeElement;
    expect(iconElement.classList).toContain('bocc-master-icon--default');
  });

  it('should handle useMask input correctly', () => {
    // Default is true
    let iconElement = fixture.debugElement.query(By.css('.bocc-master-icon')).nativeElement;
    expect(iconElement.classList).not.toContain('bocc-master-icon--no-mask');

    fixture.componentRef.setInput('useMask', false);
    fixture.detectChanges();
    expect(iconElement.classList).toContain('bocc-master-icon--no-mask');
  });

  it('should have default size 24px', () => {
    const iconElement = fixture.debugElement.query(By.css('.bocc-master-icon')).nativeElement;
    expect(iconElement.style.width).toBe('24px');
  });

  it('should change path when name changes', () => {
    fixture.componentRef.setInput('name', 'close');
    fixture.detectChanges();
    expect(component.iconPath()).toContain('close.svg');
  });
});
