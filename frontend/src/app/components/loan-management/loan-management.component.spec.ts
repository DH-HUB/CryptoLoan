import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanManagementComponent } from './loan-management.component';

import {provideHttpClient} from '@angular/common/http';

import {provideHttpClientTesting} from '@angular/common/http/testing';

describe('LoanManagementComponent', () => {
  let component: LoanManagementComponent;
  let fixture: ComponentFixture<LoanManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanManagementComponent],
        providers: [
          provideHttpClient(),
          provideHttpClientTesting()
        ]

    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
