import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PruebaMoleculaComponent } from './prueba-molecula.component';

describe('PruebaMoleculaComponent', () => {
  let component: PruebaMoleculaComponent;
  let fixture: ComponentFixture<PruebaMoleculaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PruebaMoleculaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PruebaMoleculaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
