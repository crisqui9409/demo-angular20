import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TooltipComponent } from './tooltip.component';

describe('TooltipComponent', () => {
  let component: TooltipComponent;
  let fixture: ComponentFixture<TooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TooltipComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.message()).toBe('');
    expect(component.orientation()).toBe('bottom');
    expect(component.x()).toBe(0);
    expect(component.y()).toBe(0);
    expect(component.isVisible()).toBeFalse();
  });

  describe('Visibility', () => {
    it('should show the tooltip when isVisible is true', () => {
      fixture.componentRef.setInput('isVisible', true);
      fixture.detectChanges();
      
      const hostElement: HTMLElement = fixture.nativeElement;
      expect(hostElement.classList.contains('is-visible')).toBeTrue();
      
      const bubble = hostElement.querySelector('.tooltip-bubble');
      const arrow = hostElement.querySelector('.tooltip-arrow');
      expect(bubble).toBeTruthy();
      expect(arrow).toBeTruthy();
    });

    it('should hide the tooltip when isVisible is false', () => {
      fixture.componentRef.setInput('isVisible', true);
      fixture.detectChanges();
      
      fixture.componentRef.setInput('isVisible', false);
      fixture.detectChanges();
      
      const hostElement: HTMLElement = fixture.nativeElement;
      expect(hostElement.classList.contains('is-visible')).toBeFalse();
      
      const bubble = hostElement.querySelector('.tooltip-bubble');
      expect(bubble).toBeFalsy();
    });

    it('should display the provided message', () => {
      fixture.componentRef.setInput('message', 'Custom Tooltip Message');
      fixture.componentRef.setInput('isVisible', true);
      fixture.detectChanges();
      
      const bubble = fixture.nativeElement.querySelector('.tooltip-bubble') as HTMLElement;
      expect(bubble.textContent?.trim()).toBe('Custom Tooltip Message');
    });
  });

  describe('Orientation and Positioning', () => {
    const orientations: any[] = ['top', 'bottom', 'left', 'right'];

    orientations.forEach(orient => {
      it(`should apply orientation class: orientation-${orient}`, () => {
        fixture.componentRef.setInput('orientation', orient);
        fixture.detectChanges();
        
        const hostElement: HTMLElement = fixture.nativeElement;
        expect(hostElement.classList.contains(`orientation-${orient}`)).toBeTrue();
      });
    });

    it('should apply absolute position styles from x and y signals', () => {
      component.x.set(150);
      component.y.set(200);
      fixture.detectChanges();
      
      const hostElement: HTMLElement = fixture.nativeElement;
      expect(hostElement.style.left).toBe('150px');
      expect(hostElement.style.top).toBe('200px');
    });
  });
});
