import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaProgramaMensualLabores } from './lista-programa-mensual-labores.component';

describe('ListaProgramaMensualLabores', () => {
  let component: ListaProgramaMensualLabores;
  let fixture: ComponentFixture<ListaProgramaMensualLabores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaProgramaMensualLabores]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaProgramaMensualLabores);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
