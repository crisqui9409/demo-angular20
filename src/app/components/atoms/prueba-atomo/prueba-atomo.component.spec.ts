import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PruebaAtomoComponent } from './prueba-atomo.component';

describe('PruebaAtomoComponent', () => {
  let component: PruebaAtomoComponent;
  let fixture: ComponentFixture<PruebaAtomoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PruebaAtomoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PruebaAtomoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
