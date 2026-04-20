import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DropdownComponent } from './dropdown.component';
import { By } from '@angular/platform-browser';
import { MenuClicComponent } from '../../atoms/menu-clic/menu-clic.component';
import { MasterIconComponent } from '../../atoms/master-icon/master-icon.component';
import { InputTextComponent } from '../../atoms/input-text/input-text.component';
import { TextLinkComponent } from '../../atoms/text-link/text-link.component';

describe('DropdownComponent', () => {
  let component: DropdownComponent;
  let fixture: ComponentFixture<DropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DropdownComponent, 
        MasterIconComponent, 
        MenuClicComponent, 
        InputTextComponent, 
        TextLinkComponent
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the InputText atom with search icon', () => {
    const inputAtom = fixture.debugElement.query(By.directive(InputTextComponent));
    expect(inputAtom).toBeTruthy();
    expect(inputAtom.componentInstance.iconRight()).toContain('icon-search.svg');
  });

  it('should filter options when searching (case insensitive)', () => {
    const options = ['Manzana', 'Pera', 'Plátano', 'Mango'];
    fixture.componentRef.setInput('options', options);
    
    // Type "MA"
    component.onSearchInput('MA');
    fixture.detectChanges();

    expect(component.filteredOptions().length).toBe(2);
    expect(component.filteredOptions()).toContain('Manzana');
    expect(component.filteredOptions()).toContain('Mango');
  });

  it('should open the menu automatically when typing', () => {
    component.isOpen.set(false);
    component.onSearchInput('test');
    expect(component.isOpen()).toBeTrue();
  });

  it('should set searchTerm and selectedValue when an option is clicked', () => {
    const options = ['Opción A', 'Opción B'];
    fixture.componentRef.setInput('options', options);
    component.isOpen.set(true);
    fixture.detectChanges();

    const menuItems = fixture.debugElement.queryAll(By.directive(MenuClicComponent));
    menuItems[0].componentInstance.itemClick.emit(); // Select "Opción A"
    fixture.detectChanges();

    expect(component.searchTerm()).toBe('Opción A');
    expect(component.selectedValue()).toBe('Opción A');
    expect(component.isOpen()).toBeFalse();
  });

  it('should clear selectedValue if user modifies input manually', () => {
    component.selectedValue.set('Opción A');
    component.searchTerm.set('Opción A');
    
    // User types something else
    component.onSearchInput('Opción B');
    expect(component.selectedValue()).toBeNull();
    expect(component.searchTerm()).toBe('Opción B');
  });

  it('should hide "Eliminar" link when input is cleared manually', () => {
    fixture.componentRef.setInput('showClear', true);
    component.searchTerm.set('Value');
    component.selectedValue.set('Value');
    fixture.detectChanges();
    
    expect(fixture.debugElement.query(By.directive(TextLinkComponent))).toBeTruthy();

    // Clear manually
    component.onSearchInput('');
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.directive(TextLinkComponent))).toBeNull();
  });

  it('should pass fontWeight 400 to the "Eliminar" link', () => {
    component.searchTerm.set('Content');
    fixture.detectChanges();

    const clearLink = fixture.debugElement.query(By.directive(TextLinkComponent));
    expect(clearLink.componentInstance.fontWeight()).toBe(400);
  });

  it('should clear all state when clicking "Eliminar" link', () => {
    component.searchTerm.set('To clear');
    component.selectedValue.set('Selected');
    fixture.detectChanges();

    const clearLink = fixture.debugElement.query(By.directive(TextLinkComponent));
    clearLink.componentInstance.linkClick.emit();
    fixture.detectChanges();

    expect(component.searchTerm()).toBe('');
    expect(component.selectedValue()).toBeNull();
    expect(component.isOpen()).toBeFalse();
  });

  it('should position the menu inside the trigger wrapper', () => {
    component.isOpen.set(true);
    fixture.detectChanges();

    const wrapper = fixture.debugElement.query(By.css('.dropdown__trigger-wrapper'));
    const menu = wrapper.query(By.css('.dropdown__menu'));
    expect(menu).toBeTruthy();
  });

  it('should close the menu when clicking outside', () => {
    component.isOpen.set(true);
    document.dispatchEvent(new MouseEvent('click'));
    expect(component.isOpen()).toBeFalse();
  });
});
