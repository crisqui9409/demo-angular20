import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiInputSelectCalendarComponent } from './input-select-calendar.component';

describe('InputSelectCalendarComponent', () => {
  let component: UiInputSelectCalendarComponent;
  let fixture: ComponentFixture<UiInputSelectCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiInputSelectCalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiInputSelectCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
