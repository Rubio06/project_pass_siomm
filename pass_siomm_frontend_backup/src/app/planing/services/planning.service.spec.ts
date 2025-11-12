import { TestBed } from '@angular/core/testing';


describe('Planning', () => {
  let service: Planning;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Planning);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
