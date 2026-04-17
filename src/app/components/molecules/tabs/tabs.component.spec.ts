import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabsComponent, TabItem } from './tabs.component';
import { By } from '@angular/platform-browser';
import { MasterIconComponent } from '../../atoms/master-icon/master-icon.component';

describe('TabsComponent', () => {
  let component: TabsComponent;
  let fixture: ComponentFixture<TabsComponent>;

  const mockTabs: TabItem[] = [
    { id: 'tab1', label: 'Tab 1', icon: 'burger' },
    { id: 'tab2', label: 'Tab 2' },
    { id: 'tab3', label: 'Tab 3' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsComponent, MasterIconComponent],
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

  describe('Active State and Icons', () => {
    it('should apply is-active class to the active tab', () => {
      const activeTab = fixture.debugElement.query(By.css('.bocc-tabs-item.is-active'));
      expect(activeTab.nativeElement.textContent).toContain('Tab 1');
    });

    it('should use brand color for icon in active tab', () => {
      const activeTabIcon = fixture.debugElement.query(By.css('.is-active bocc-master-icon'));
      expect(activeTabIcon.componentInstance.color()).toBe('brand');
    });

    it('should use default color for icon in inactive tab', () => {
      // Set icon for tab 2 and make tab 1 active
      const tabsWithIcons: TabItem[] = [
        { id: 'tab1', label: 'Tab 1', icon: 'burger' },
        { id: 'tab2', label: 'Tab 2', icon: 'calendar' },
      ];
      fixture.componentRef.setInput('tabs', tabsWithIcons);
      fixture.componentRef.setInput('activeTabId', 'tab1');
      fixture.detectChanges();

      const inactiveTabIcon = fixture.debugElement.queryAll(By.css('bocc-master-icon'))[1];
      expect(inactiveTabIcon.componentInstance.color()).toBe('default');
    });
  });

  describe('Events', () => {
    it('should emit tabChange event when a different tab is clicked', () => {
      const tabChangeSpy = spyOn(component.tabChange, 'emit');
      const secondTab = fixture.debugElement.queryAll(By.css('.bocc-tabs-item'))[1];

      secondTab.nativeElement.click();

      expect(tabChangeSpy).toHaveBeenCalledWith('tab2');
    });
  });
});
