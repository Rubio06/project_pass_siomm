import { TestBed } from '@angular/core/testing';

import { MostrarDatosFiltros } from './mostrar-datos-filtros.service';

describe('MostrarDatosFiltros', () => {
  let service: MostrarDatosFiltros;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MostrarDatosFiltros);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
