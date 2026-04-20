import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailAgreementCardComponent } from './detail-agreement-card.component';
import { By } from '@angular/platform-browser';

describe('DetailAgreementCardComponent', () => {
  let component: DetailAgreementCardComponent;
  let fixture: ComponentFixture<DetailAgreementCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailAgreementCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailAgreementCardComponent);
    component = fixture.componentInstance;

    // Set required inputs for the component
    fixture.componentRef.setInput('zone', 'North Zone');
    fixture.componentRef.setInput('channel', 'Digital');
    fixture.componentRef.setInput('segment', 'Premium');
    fixture.componentRef.setInput('payrollLoanType', 'Traditional Loan');
    fixture.componentRef.setInput('portfolioStatus', 'Active');
    fixture.componentRef.setInput('closing', '2026-12-31');
    fixture.componentRef.setInput('customerIdentification', '1098765432');
    fixture.componentRef.setInput('creditNumber', 'LN-2024-001');
    fixture.componentRef.setInput('customerName', 'Lucía Pérez');
    fixture.componentRef.setInput('agreementNit', '900.123.456-7');

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with the "Datos de cliente" section closed', () => {
    expect(component.isExpanded()).toBeFalse();
    
    // There are 3 sections in total, but only 2 bodies should be rendered initially
    const bodies = fixture.debugElement.queryAll(By.css('.agreement-card__body'));
    expect(bodies.length).toBe(2);
  });

  it('should display the general and portfolio info correctly', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.innerHTML).toContain('North Zone');
    expect(compiled.innerHTML).toContain('Traditional Loan');
    expect(compiled.innerHTML).toContain('Active');
  });

  it('should toggle isExpanded when the toggleable title is clicked', () => {
    const toggleHeader = fixture.debugElement.query(By.css('.agreement-card__title--toggle'));
    
    // Click to expand
    toggleHeader.nativeElement.click();
    fixture.detectChanges();
    expect(component.isExpanded()).toBeTrue();
    
    // Check if the 3rd body is now visible
    let bodies = fixture.debugElement.queryAll(By.css('.agreement-card__body'));
    expect(bodies.length).toBe(3);
    
    // Check if customer info is displayed
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.innerHTML).toContain('Lucía Pérez');
    expect(compiled.innerHTML).toContain('1098765432');

    // Click to collapse
    toggleHeader.nativeElement.click();
    fixture.detectChanges();
    expect(component.isExpanded()).toBeFalse();
    
    // Check if the 3rd body is hidden again
    bodies = fixture.debugElement.queryAll(By.css('.agreement-card__body'));
    expect(bodies.length).toBe(2);
  });

  it('should apply the "is-rotated" class to the arrow when expanded', () => {
    const arrowIcon = fixture.debugElement.query(By.css('.agreement-card__arrow')).nativeElement;
    const toggleHeader = fixture.debugElement.query(By.css('.agreement-card__title--toggle'));

    expect(arrowIcon.classList.contains('is-rotated')).toBeFalse();

    toggleHeader.nativeElement.click();
    fixture.detectChanges();

    expect(arrowIcon.classList.contains('is-rotated')).toBeTrue();
  });

  it('should correctly format full-width items using the modifier class', () => {
    // Expand to see full-width items
    component.toggleExpanded();
    fixture.detectChanges();

    const fullItems = fixture.debugElement.queryAll(By.css('.agreement-card__item--full'));
    expect(fullItems.length).toBe(2); // Name and NIT
  });
});
