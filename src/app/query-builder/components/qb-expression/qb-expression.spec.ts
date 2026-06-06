import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbExpression } from './qb-expression';

describe('QbExpression', () => {
  let component: QbExpression;
  let fixture: ComponentFixture<QbExpression>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QbExpression],
    }).compileComponents();

    fixture = TestBed.createComponent(QbExpression);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
