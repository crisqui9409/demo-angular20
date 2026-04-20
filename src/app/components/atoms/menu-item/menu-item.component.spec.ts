import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiMenuItemComponent } from './menu-item.component';

describe('MenuItemComponent', () => {
  let component: UiMenuItemComponent;
  let fixture: ComponentFixture<UiMenuItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiMenuItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
