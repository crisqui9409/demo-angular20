import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabsComponent, TabItem } from './tabs.component';
import { By } from '@angular/platform-browser';

describe('TabsComponent', () => {
  let component: TabsComponent;
  let fixture: ComponentFixture<TabsComponent>;

  const mockTabs: TabItem[] = [
    { id: 'tab1', label: 'Tab 1', icon: 'user' },
    { id: 'tab2', label: 'Tab 2' },
    { id: 'tab3', label: 'Tab 3' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TabsComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('tabs', mockTabs);
    fixture.componentRef.setInput('activeTabId', 'tab1');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all tabs', () => {
    const tabElements = fixture.debugElement.queryAll(By.css('.bocc-tabs-item'));
    expect(tabElements.length).toBe(mockTabs.length);
  });

  describe('Active State and Accessibility', () => {
    it('should apply is-active class and aria-selected="true" to the active tab', () => {
      const activeTab = fixture.debugElement.query(By.css('.bocc-tabs-item.is-active'));
      expect(activeTab.nativeElement.textContent).toContain('Tab 1');
      expect(activeTab.nativeElement.getAttribute('aria-selected')).toBe('true');
    });

    it('should have aria-selected="false" for non-active tabs', () => {
      const secondTab = fixture.debugElement.queryAll(By.css('.bocc-tabs-item'))[1];
      expect(secondTab.nativeElement.getAttribute('aria-selected')).toBe('false');
    });

    it('should have correct aria-controls attribute', () => {
      const firstTab = fixture.debugElement.queryAll(By.css('.bocc-tabs-item'))[0];
      expect(firstTab.nativeElement.getAttribute('aria-controls')).toBe('tab-panel-tab1');
    });

    it('should have role="tablist" and role="tab"', () => {
      const list = fixture.debugElement.query(By.css('.bocc-tabs-list'));
      const item = fixture.debugElement.query(By.css('.bocc-tabs-item'));
      expect(list.nativeElement.getAttribute('role')).toBe('tablist');
      expect(item.nativeElement.getAttribute('role')).toBe('tab');
    });
  });

  describe('Events and Interaction', () => {
    it('should emit tabChange event when a different tab is clicked', () => {
      const tabChangeSpy = spyOn(component.tabChange, 'emit');
      const secondTab = fixture.debugElement.queryAll(By.css('.bocc-tabs-item'))[1];

      secondTab.nativeElement.click();

      expect(tabChangeSpy).toHaveBeenCalledWith('tab2');
    });

    it('should not emit tabChange event when the active tab is clicked', () => {
      const tabChangeSpy = spyOn(component.tabChange, 'emit');
      const activeTab = fixture.debugElement.query(By.css('.bocc-tabs-item.is-active'));

      activeTab.nativeElement.click();

      expect(tabChangeSpy).not.toHaveBeenCalled();
    });

    it('should handle keyboard interaction (Enter)', () => {
      const tabChangeSpy = spyOn(component.tabChange, 'emit');
      const secondTab = fixture.debugElement.queryAll(By.css('.bocc-tabs-item'))[1];

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      secondTab.nativeElement.dispatchEvent(event);

      expect(tabChangeSpy).toHaveBeenCalledWith('tab2');
    });

    it('should handle keyboard interaction (Space)', () => {
      const tabChangeSpy = spyOn(component.tabChange, 'emit');
      const thirdTab = fixture.debugElement.queryAll(By.css('.bocc-tabs-item'))[2];

      const event = new KeyboardEvent('keydown', { key: ' ' });
      thirdTab.nativeElement.dispatchEvent(event);

      expect(tabChangeSpy).toHaveBeenCalledWith('tab3');
    });
  });

  it('should render icon if provided', () => {
    const firstTabIcon = fixture.debugElement.query(By.css('.bocc-tabs-icon'));
    expect(firstTabIcon).toBeTruthy();
    expect(firstTabIcon.nativeElement.classList).toContain('fa-user');
  });

  it('should not render icon if not provided', () => {
    const secondTab = fixture.debugElement.queryAll(By.css('.bocc-tabs-item'))[1];
    const icon = secondTab.query(By.css('.bocc-tabs-icon'));
    expect(icon).toBeNull();
  });
});
