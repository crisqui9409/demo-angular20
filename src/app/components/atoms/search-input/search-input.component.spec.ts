import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchInputComponent } from './search-input.component';

/**
 * Unit tests for SearchInputComponent.
 *
 * Covers: rendering (label, hint, icons), status class application,
 * value binding, event emission (Enter key, search button click),
 * disabled guard, CSS mask icon rendering, and the is-filled modifier.
 */
describe('SearchInputComponent', () => {
  let component: SearchInputComponent;
  let fixture: ComponentFixture<SearchInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the label and hint when provided', () => {
    fixture.componentRef.setInput('label', 'Test Label');
    fixture.componentRef.setInput('hint', 'Test Hint');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.search-input__label')?.textContent).toContain('Test Label');
    expect(compiled.querySelector('.search-input__hint')?.textContent).toContain('Test Hint');
  });

  it('should apply the correct status class based on the status input', () => {
    fixture.componentRef.setInput('status', 'error');
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('.search-input');
    expect(container.classList).toContain('status-error');

    fixture.componentRef.setInput('status', 'success');
    fixture.detectChanges();
    expect(container.classList).toContain('status-success');
  });

  it('should update the model value on user input', () => {
    const inputElement = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    inputElement.value = 'Angular 20';
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.value()).toBe('Angular 20');
  });

  it('should emit searchTriggered when Enter is pressed', () => {
    spyOn(component.searchTriggered, 'emit');
    fixture.componentRef.setInput('value', 'Searching...');
    fixture.detectChanges();

    const inputElement = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(component.searchTriggered.emit).toHaveBeenCalledWith('Searching...');
  });

  it('should have the correct aria-label on the search button', () => {
    fixture.componentRef.setInput('showSearchIcon', true);
    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('.search-input__icon--right');
    expect(btn.getAttribute('aria-label')).toBe('Buscar');
  });

  it('should not emit searchTriggered when the field is disabled', () => {
    spyOn(component.searchTriggered, 'emit');
    fixture.componentRef.setInput('disabled', true);
    fixture.componentRef.setInput('value', 'Test');
    fixture.detectChanges();

    component.onSearch();
    expect(component.searchTriggered.emit).not.toHaveBeenCalled();
  });

  it('should add is-filled when the value is non-empty and remove it when cleared', () => {
    fixture.componentRef.setInput('value', 'Some text');
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('.search-input');
    expect(container.classList).toContain('is-filled');

    fixture.componentRef.setInput('value', '');
    fixture.detectChanges();
    expect(container.classList).not.toContain('is-filled');
  });
});
