import { TestBed } from '@angular/core/testing';

import { PlaningCompartido } from './module/planing/opciones-componentes/apertura-periodo-operativo/services/planing-compartido.service';

describe('PlaningCompartido', () => {
  let service: PlaningCompartido;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlaningCompartido);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
