import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuaranteeManagementComponent } from './guarantee-management.component';

import {provideHttpClient} from '@angular/common/http';

import {provideHttpClientTesting} from '@angular/common/http/testing';

describe('GuaranteeManagementComponent', () => {
  let component: GuaranteeManagementComponent;
  let fixture: ComponentFixture<GuaranteeManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuaranteeManagementComponent],
        providers: [
      provideHttpClient(),
      provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuaranteeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
