import { Component, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TooltipDirective } from './tooltip.directive';
import { By } from '@angular/platform-browser';
import { TooltipOrientation } from '../types/component_type';

// Host component for testing the directive
@Component({
  standalone: true,
  imports: [TooltipDirective],
  template: `
    <div id="trigger" [boccTooltip]="'Test Message'" [orientation]="'top'">
      Hover me
    </div>
  `
})
class TestHostComponent {}

describe('TooltipDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let triggerEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, TooltipDirective]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    triggerEl = fixture.nativeElement.querySelector('#trigger');
  });

  afterEach(() => {
    // Clean up body after each test to avoid polluting other tests
    const tooltip = document.querySelector('bocc-tooltip');
    if (tooltip) {
      tooltip.remove();
    }
  });

  it('should create the host component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should append the tooltip to the body on mouseenter', () => {
    triggerEl.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    const tooltip = document.body.querySelector('bocc-tooltip');
    expect(tooltip).toBeTruthy();
    expect(tooltip?.textContent).toContain('Test Message');
  });

  it('should remove the tooltip from the body on mouseleave', () => {
    triggerEl.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    expect(document.body.querySelector('bocc-tooltip')).toBeTruthy();

    triggerEl.dispatchEvent(new MouseEvent('mouseleave'));
    fixture.detectChanges();
    expect(document.body.querySelector('bocc-tooltip')).toBeFalsy();
  });

  it('should show tooltip on focusin and hide on focusout', () => {
    triggerEl.dispatchEvent(new Event('focusin'));
    fixture.detectChanges();
    expect(document.body.querySelector('bocc-tooltip')).toBeTruthy();

    triggerEl.dispatchEvent(new Event('focusout'));
    fixture.detectChanges();
    expect(document.body.querySelector('bocc-tooltip')).toBeFalsy();
  });

  it('should pass correct orientation to the tooltip component (may flip depending on viewport)', () => {
    triggerEl.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    const tooltip = document.body.querySelector('bocc-tooltip');
    // The TooltipComponent applies orientation as a class 'orientation-top' or 'orientation-bottom' (if it flips)
    const hasOrientationClass = 
      tooltip?.classList.contains('orientation-top') || 
      tooltip?.classList.contains('orientation-bottom');
    
    expect(hasOrientationClass).toBeTrue();
  });

  it('should clean up on directive destruction', () => {
    triggerEl.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    expect(document.body.querySelector('bocc-tooltip')).toBeTruthy();

    fixture.destroy(); // This triggers ngOnDestroy of the directive
    expect(document.body.querySelector('bocc-tooltip')).toBeFalsy();
  });
});
