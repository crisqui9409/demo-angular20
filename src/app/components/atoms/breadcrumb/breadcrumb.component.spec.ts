import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BreadcrumbComponent, BreadcrumbItem } from './breadcrumb.component';

/**
 * Unit tests for BreadcrumbComponent.
 * Verifies rendering logic, active state handling, and accessibility requirements.
 */
describe('BreadcrumbComponent', () => {
  let component: BreadcrumbComponent;
  let fixture: ComponentFixture<BreadcrumbComponent>;

  const mockItems: BreadcrumbItem[] = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'Details', active: true }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreadcrumbComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;
    
    // Set mock inputs via the new signal API
    fixture.componentRef.setInput('items', mockItems);
    fixture.detectChanges();
  });

  // --- Suite: Component Lifecycle ---
  it('should initialize the component correctly', () => {
    expect(component).toBeTruthy();
  });

  // --- Suite: Rendering Engine ---
  it('should render the exact number of breadcrumb nodes provided', () => {
    const nodes = fixture.nativeElement.querySelectorAll('.breadcrumb-item');
    expect(nodes.length).toBe(mockItems.length);
  });

  it('should display the correct textual labels for all segments', () => {
    const textContent = fixture.nativeElement.textContent;
    mockItems.forEach((item) => expect(textContent).toContain(item.label));
  });

  it('should correctly position separators (n-1 logic)', () => {
    const separators = fixture.nativeElement.querySelectorAll('.separator');
    expect(separators.length).toBe(mockItems.length - 1);
  });

  // --- Suite: State & Accessibility ---
  it('should apply active visual state and aria-current to the terminal node', () => {
    const activeItem = fixture.nativeElement.querySelector('.breadcrumb-item.active');
    expect(activeItem).toBeTruthy();
    expect(activeItem.getAttribute('aria-current')).toBe('page');
    expect(activeItem.textContent).toContain('Details');
  });

  it('should render interactive anchors only for non-active segments with paths', () => {
    const links = fixture.nativeElement.querySelectorAll('.breadcrumb-link');
    expect(links.length).toBe(2); // 'Home' and 'Products'
  });
});
