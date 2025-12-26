import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentralTabs } from './central-tabs';

describe('CentralTabs', () => {
  let component: CentralTabs;
  let fixture: ComponentFixture<CentralTabs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CentralTabs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CentralTabs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
