import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardPriorityComponent } from './card-priority.component';
import { By } from '@angular/platform-browser';
import { MenuClicComponent } from '../../atoms/menu-clic/menu-clic.component';

describe('CardPriorityComponent', () => {
  let component: CardPriorityComponent;
  let fixture: ComponentFixture<CardPriorityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardPriorityComponent, MenuClicComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardPriorityComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the provided options as menu items', () => {
    const testOptions = ['Alta', 'Media', 'Baja'];
    fixture.componentRef.setInput('options', testOptions);
    fixture.detectChanges();

    const menuItems = fixture.debugElement.queryAll(By.directive(MenuClicComponent));
    expect(menuItems.length).toBe(3);
    expect(menuItems[0].componentInstance.label()).toBe('Alta');
    expect(menuItems[1].componentInstance.label()).toBe('Media');
    expect(menuItems[2].componentInstance.label()).toBe('Baja');
  });

  it('should not show chevrons on menu items', () => {
    fixture.componentRef.setInput('options', ['Opción 1']);
    fixture.detectChanges();

    const menuItem = fixture.debugElement.query(By.directive(MenuClicComponent));
    expect(menuItem.componentInstance.showChevron()).toBeFalse();
  });

  it('should emit prioritySelected when an option is clicked', () => {
    const testOptions = ['Criterio 1', 'Criterio 2'];
    fixture.componentRef.setInput('options', testOptions);
    fixture.detectChanges();

    // SPY on the output
    let emittedPriority: string | undefined;
    component.prioritySelected.subscribe((priority) => (emittedPriority = priority));

    // Find the first menu item and trigger its click output
    const menuItem = fixture.debugElement.query(By.directive(MenuClicComponent));
    menuItem.componentInstance.itemClick.emit();

    expect(emittedPriority).toBe('Criterio 1');
  });

  it('should have a container with the correct class and style', () => {
    const listElement = fixture.debugElement.query(By.css('.priority-list'));
    expect(listElement).toBeTruthy();
    
    // Check if it's a flex column as per SCSS
    const styles = window.getComputedStyle(listElement.nativeElement);
    expect(styles.display).toBe('flex');
    expect(styles.flexDirection).toBe('column');
  });
});
