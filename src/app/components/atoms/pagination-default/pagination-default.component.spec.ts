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

  it('should display all pages when totalPages <= 5', () => {
    fixture.componentRef.setInput('totalPages', 4);
    fixture.detectChanges();
    const pageButtons = fixture.debugElement.queryAll(By.css('.bocc-pagination-number'));
    expect(pageButtons.length).toBe(4);
    expect(pageButtons[3].nativeElement.textContent.trim()).toBe('4');
  });

  it('should display end ellipsis when on page 1 of many', () => {
    fixture.componentRef.setInput('currentPage', 1);
    fixture.componentRef.setInput('totalPages', 15);
    fixture.detectChanges();
    const pageButtons = fixture.debugElement.queryAll(By.css('.bocc-pagination-number'));
    expect(pageButtons.length).toBe(4); // 1, 2, 3 ... 15
    expect(fixture.debugElement.query(By.css('.bocc-pagination-ellipsis'))).toBeTruthy();
  });

  it('should display start ellipsis when near the end', () => {
    fixture.componentRef.setInput('currentPage', 15);
    fixture.componentRef.setInput('totalPages', 15);
    fixture.detectChanges();
    const pageButtons = fixture.debugElement.queryAll(By.css('.bocc-pagination-number'));
    expect(pageButtons.length).toBe(4); // 1 ... 13, 14, 15
    expect(pageButtons[0].nativeElement.textContent.trim()).toBe('1');
    expect(pageButtons[1].nativeElement.textContent.trim()).toBe('13');
    expect(fixture.debugElement.query(By.css('.bocc-pagination-ellipsis'))).toBeTruthy();
  });

  it('should display both start and end ellipsis when in the middle', () => {
    fixture.componentRef.setInput('currentPage', 7);
    fixture.componentRef.setInput('totalPages', 15);
    fixture.detectChanges();
    const pageButtons = fixture.debugElement.queryAll(By.css('.bocc-pagination-number'));
    expect(pageButtons.length).toBe(3); // 1 ... 7 ... 15
    const ellipsis = fixture.debugElement.queryAll(By.css('.bocc-pagination-ellipsis'));
    expect(ellipsis.length).toBe(2);
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

      const ellipsisBtn = fixture.debugElement.query(By.css('.bocc-pagination-ellipsis'));
      ellipsisBtn.nativeElement.click();
      fixture.detectChanges();

      const dropdownItems = fixture.debugElement.queryAll(By.css('.bocc-pagination-dropdown-item'));
      dropdownItems[1].nativeElement.click();

      expect(pageSpy).toHaveBeenCalledWith(5);
      expect(component.isEndDropdownOpen()).toBeFalse();
    });

    it('should close dropdown when clicking outside', () => {
      component.isEndDropdownOpen.set(true);
      fixture.detectChanges();

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
    expect(list.classList).toContain('bocc-pagination-list');
  });
});
