import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputSelectCalendarComponent } from './input-select-calendar.component';

describe('InputSelectCalendarComponent', () => {
  let component: InputSelectCalendarComponent;
  let fixture: ComponentFixture<InputSelectCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputSelectCalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputSelectCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
