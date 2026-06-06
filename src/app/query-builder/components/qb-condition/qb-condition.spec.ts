import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbCondition } from './qb-condition';

describe('QbCondition', () => {
  let component: QbCondition;
  let fixture: ComponentFixture<QbCondition>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QbCondition],
    }).compileComponents();

    fixture = TestBed.createComponent(QbCondition);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
