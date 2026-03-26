import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PruebaTemplateComponent } from './prueba-template.component';

describe('PruebaTemplateComponent', () => {
  let component: PruebaTemplateComponent;
  let fixture: ComponentFixture<PruebaTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PruebaTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PruebaTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
