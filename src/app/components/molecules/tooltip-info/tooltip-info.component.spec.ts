import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TooltipInfoComponent } from './tooltip-info.component';
import { TooltipOrientation } from '../../../types/component_type';
import { ES_TOOLTIP_INFO } from '../../../utils/lang/es_component';
import { By } from '@angular/platform-browser';
import { MasterIconComponent } from '../../atoms/master-icon/master-icon.component';
import { TooltipDirective } from '../../../directives/tooltip.directive';

describe('TooltipInfoComponent', () => {
  let component: TooltipInfoComponent;
  let fixture: ComponentFixture<TooltipInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TooltipInfoComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TooltipInfoComponent);
    component = fixture.componentInstance;
    
    // Set required input
    fixture.componentRef.setInput('message', 'Test message');
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Icon Rendering', () => {
    it('should render the master icon with correct default configuration', () => {
      const iconDe = fixture.debugElement.query(By.directive(MasterIconComponent));
      const iconInstance = iconDe.componentInstance;

      expect(iconDe).toBeTruthy();
      expect(iconInstance.useMask()).toBeFalse();
      expect(iconInstance.name()).toBe(ES_TOOLTIP_INFO.DEFAULT_ICON);
      expect(iconInstance.size()).toBe(ES_TOOLTIP_INFO.DEFAULT_SIZE);
      expect(iconDe.nativeElement.classList).toContain('info-icon');
    });
  });

  describe('Tooltip Integration', () => {
    it('should have the tooltip directive applied to the icon with default values', () => {
      const iconDe = fixture.debugElement.query(By.directive(MasterIconComponent));
      const directive = iconDe.injector.get(TooltipDirective);
      
      expect(directive).toBeTruthy();
      expect(directive.message).toBe('Test message');
      expect(directive.orientation).toBe(TooltipOrientation.Bottom);
    });

    it('should update tooltip message when input changes', () => {
      fixture.componentRef.setInput('message', 'New updated message');
      fixture.detectChanges();
      
      const iconDe = fixture.debugElement.query(By.directive(MasterIconComponent));
      const directive = iconDe.injector.get(TooltipDirective);
      
      expect(directive.message).toBe('New updated message');
    });

    it('should update tooltip orientation when input changes', () => {
      fixture.componentRef.setInput('orientation', TooltipOrientation.Top);
      fixture.detectChanges();
      
      const iconDe = fixture.debugElement.query(By.directive(MasterIconComponent));
      const directive = iconDe.injector.get(TooltipDirective);
      
      expect(directive.orientation).toBe(TooltipOrientation.Top);
    });

    it('should support custom string for orientation', () => {
      fixture.componentRef.setInput('orientation', 'left');
      fixture.detectChanges();
      
      const iconDe = fixture.debugElement.query(By.directive(MasterIconComponent));
      const directive = iconDe.injector.get(TooltipDirective);
      
      expect(directive.orientation).toBe('left');
    });
  });

  describe('Tabindex', () => {
    it('should have tabindex 0 on the wrapper for accessibility', () => {
      const wrapper = fixture.debugElement.query(By.css('.tooltip-info-wrapper'));
      expect(wrapper.nativeElement.getAttribute('tabindex')).toBe('0');
    });
  });
});

