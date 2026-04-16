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
    
    expect(component.iconPath()).toBe('assets/icoins/calendar.svg');
    
    const iconElement = fixture.debugElement.query(By.css('.bocc-master-icon')).nativeElement;
    // Check that mask-image or the custom property includes the correct path
    expect(iconElement.style.getPropertyValue('--icon-path')).toContain('assets/icoins/calendar.svg');
  });

  it('should apply the correct size', () => {
    const customSize = '48px';
    fixture.componentRef.setInput('size', customSize);
    fixture.detectChanges();

    const iconElement = fixture.debugElement.query(By.css('.bocc-master-icon')).nativeElement;
    expect(iconElement.style.width).toBe(customSize);
    expect(iconElement.style.height).toBe(customSize);
  });

  it('should apply the correct color theme class', () => {
    fixture.componentRef.setInput('color', 'brand');
    fixture.detectChanges();

    const iconElement = fixture.debugElement.query(By.css('.bocc-master-icon')).nativeElement;
    expect(iconElement.classList).toContain('bocc-master-icon--brand');
  });

  it('should change path when name changes', () => {
    fixture.componentRef.setInput('name', 'close');
    fixture.detectChanges();
    expect(component.iconPath()).toContain('close.svg');
  });
});
