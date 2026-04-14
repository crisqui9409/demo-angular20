import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuItemComponent } from './menu-item.component';

describe('MenuItemComponent', () => {
  let component: MenuItemComponent;
  let fixture: ComponentFixture<MenuItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuItemComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuItemComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('label', 'Cambiar prioridad');
    fixture.detectChanges();
  });

  /**
   * Component Initialization
   */
  it('should initialize the component instance correctly', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Data Binding & Logic
   */
  it('should render the provided label text accurately', () => {
    const text = fixture.nativeElement.querySelector('.menu-item__label').textContent.trim();
    expect(text).toBe('Cambiar prioridad');
  });

  it('should toggle trailing chevron visibility based on showChevron input', () => {
    fixture.componentRef.setInput('showChevron', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.menu-item__chevron')).toBeNull();

    fixture.componentRef.setInput('showChevron', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.menu-item__chevron')).toBeTruthy();
  });

  /**
   * Interaction & Accessibility
   */
  it('should emit the itemClick output when the component is clicked', () => {
    const spy = jasmine.createSpy('itemClick');
    component.itemClick.subscribe(spy);

    fixture.nativeElement.querySelector('.menu-item').click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should prevent itemClick emissions when the component is disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const spy = jasmine.createSpy('itemClick');
    component.itemClick.subscribe(spy);

    component.handleClick();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should apply the disabled state to the underlying button element', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    
    const btn = fixture.nativeElement.querySelector('.menu-item');
    expect(btn.disabled).toBeTrue();
  });
});
