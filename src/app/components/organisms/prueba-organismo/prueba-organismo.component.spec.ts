import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PruebaOrganismoComponent } from './prueba-organismo.component';

describe('PruebaOrganismoComponent', () => {
  let component: PruebaOrganismoComponent;
  let fixture: ComponentFixture<PruebaOrganismoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PruebaOrganismoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PruebaOrganismoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
