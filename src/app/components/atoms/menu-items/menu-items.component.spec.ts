import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuItemsComponent, MenuItem } from './menu-items.component';
import { By } from '@angular/platform-browser';

describe('MenuItemsComponent', () => {
  let component: MenuItemsComponent;
  let fixture: ComponentFixture<MenuItemsComponent>;

  const mockItems: MenuItem[] = [
    { id: 1, label: 'Inicio', icon: 'house' },
    { id: 2, label: 'Perfil', icon: 'user' },
    { id: 3, label: 'Configuración', icon: 'gear', disabled: true },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuItemsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuItemsComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('items', mockItems);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all items', () => {
    const items = fixture.debugElement.queryAll(By.css('.bocc-menu-item'));
    expect(items.length).toBe(mockItems.length);
  });

  describe('Expanded state (default)', () => {
    it('should show labels when expanded', () => {
      const labels = fixture.debugElement.queryAll(By.css('.bocc-menu-item-label'));
      expect(labels.length).toBe(3);
      expect(labels[0].nativeElement.textContent).toContain('Inicio');
    });

    it('should show icons', () => {
      const icons = fixture.debugElement.queryAll(By.css('.bocc-menu-item-icon'));
      expect(icons.length).toBe(3);
    });
  });

  describe('Collapsed state', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('isExpanded', false);
      fixture.detectChanges();
    });

    it('should NOT show labels when collapsed', () => {
      const labels = fixture.debugElement.queryAll(By.css('.bocc-menu-item-label'));
      expect(labels.length).toBe(0);
    });

    it('should STILL show icons when collapsed', () => {
      const icons = fixture.debugElement.queryAll(By.css('.bocc-menu-item-icon'));
      expect(icons.length).toBe(3);
    });

    it('should have is-collapsed class on the list', () => {
      const list = fixture.debugElement.query(By.css('.bocc-menu-items'));
      expect(list.nativeElement.classList).toContain('is-collapsed');
    });
  });

  it('should emit itemClick event when an item is clicked', () => {
    const clickSpy = spyOn(component.itemClick, 'emit');
    const firstItem = fixture.debugElement.queryAll(By.css('.bocc-menu-item'))[0];

    firstItem.nativeElement.click();

    expect(clickSpy).toHaveBeenCalledWith(mockItems[0]);
  });
});
