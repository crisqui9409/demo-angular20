import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiTextLinkComponent } from './text-link.component';

describe('TextLinkComponent', () => {
  let component: UiTextLinkComponent;
  let fixture: ComponentFixture<UiTextLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiTextLinkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiTextLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
