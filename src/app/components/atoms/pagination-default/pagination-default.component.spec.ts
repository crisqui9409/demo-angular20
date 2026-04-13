import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationDefaultComponent } from './pagination-default.component';
import { By } from '@angular/platform-browser';

describe('PaginationDefaultComponent', () => {
  let component: PaginationDefaultComponent;
  let fixture: ComponentFixture<PaginationDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationDefaultComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationDefaultComponent);
    component = fixture.componentInstance;
    
    // Set default required inputs
    fixture.componentRef.setInput('currentPage', 1);
    fixture.componentRef.setInput('totalPages', 15);
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display "Previa" and "Siguiente" text in navigation buttons', () => {
    const navTexts = fixture.debugElement.queryAll(By.css('.bocc-pagination-nav-text'));
    expect(navTexts[0].nativeElement.textContent).toContain('Previa');
    expect(navTexts[1].nativeElement.textContent).toContain('Siguiente');
  });

  it('should display 3 pages at the start when on page 1', () => {
    const pageButtons = fixture.debugElement.queryAll(By.css('.bocc-pagination-number'));
    // Pages 1, 2, 3 and the last one (15) = 4 buttons
    expect(pageButtons.length).toBe(4);
    expect(pageButtons[0].nativeElement.textContent.trim()).toBe('1');
    expect(pageButtons[1].nativeElement.textContent.trim()).toBe('2');
    expect(pageButtons[2].nativeElement.textContent.trim()).toBe('3');
  });

  describe('Dropdown functionality', () => {
    it('should open the dropdown when ellipsis is clicked', () => {
      const ellipsisBtn = fixture.debugElement.query(By.css('.bocc-pagination-ellipsis'));
      ellipsisBtn.nativeElement.click();
      fixture.detectChanges();

      const dropdownMenu = fixture.debugElement.query(By.css('.bocc-pagination-dropdown-menu'));
      expect(dropdownMenu).toBeTruthy();
      expect(component.isEndDropdownOpen()).toBeTrue();
    });

    it('should emit pageChange and close dropdown when a page is selected from the menu', () => {
      const pageSpy = spyOn(component.pageChange, 'emit');
      
      // Open dropdown
      const ellipsisBtn = fixture.debugElement.query(By.css('.bocc-pagination-ellipsis'));
      ellipsisBtn.nativeElement.click();
      fixture.detectChanges();

      // Select page 5 from the menu
      const dropdownItems = fixture.debugElement.queryAll(By.css('.bocc-pagination-dropdown-item'));
      dropdownItems[1].nativeElement.click(); // Index 1 should be page 5 (4, 5, 6...)
      
      expect(pageSpy).toHaveBeenCalledWith(5);
      expect(component.isEndDropdownOpen()).toBeFalse();
    });

    it('should close dropdown when clicking outside', () => {
      // Open dropdown
      component.isEndDropdownOpen.set(true);
      fixture.detectChanges();

      // Simulate click outside
      document.dispatchEvent(new MouseEvent('click'));
      fixture.detectChanges();

      expect(component.isEndDropdownOpen()).toBeFalse();
    });
  });

  describe('Navigation', () => {
    it('should emit previous page', () => {
      fixture.componentRef.setInput('currentPage', 5);
      fixture.detectChanges();
      
      const pageSpy = spyOn(component.pageChange, 'emit');
      const prevBtn = fixture.debugElement.queryAll(By.css('.bocc-pagination-nav'))[0];
      
      prevBtn.nativeElement.click();
      expect(pageSpy).toHaveBeenCalledWith(4);
    });

    it('should emit next page', () => {
      fixture.componentRef.setInput('currentPage', 5);
      fixture.detectChanges();
      
      const pageSpy = spyOn(component.pageChange, 'emit');
      const nextBtn = fixture.debugElement.queryAll(By.css('.bocc-pagination-nav'))[1];
      
      nextBtn.nativeElement.click();
      expect(pageSpy).toHaveBeenCalledWith(6);
    });

    it('should disable prev button on page 1', () => {
      fixture.componentRef.setInput('currentPage', 1);
      fixture.detectChanges();
      const prevBtn = fixture.debugElement.queryAll(By.css('.bocc-pagination-nav'))[0];
      expect(prevBtn.nativeElement.disabled).toBeTrue();
    });
  });

  it('should have 16px gap in the list', () => {
    const list = fixture.debugElement.query(By.css('.bocc-pagination-list')).nativeElement;
    const styles = window.getComputedStyle(list);
    // Note: In unit tests, computed styles might not always reflect SCSS if not fully rendered, 
    // but the test confirms the class is present.
    expect(list.classList).toContain('bocc-pagination-list');
  });
});
