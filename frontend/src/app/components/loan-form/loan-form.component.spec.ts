
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { LoanFormComponent } from './loan-form.component';
import { Loan, LoanApi } from '../../services/loan.api';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';

describe('LoanFormComponent', () => {
  let fixture: ComponentFixture<LoanFormComponent>;
  let component: LoanFormComponent;
  let api: jasmine.SpyObj<LoanApi>;

  const mockLoan: Loan = {
    id: 1,
    borrowerEmail: 'test@example.com',
    borrowerName: 'Test User',
    amountEur: 1000,
    liquidationRatio: 1.5,
    status: 'PENDING',
    collateralSymbol: 'bitcoin',
    collateralAmount: 0.1,
    createdAt: '2026-09-23T10:00:00Z'
  };

  beforeEach(async () => {
    api = jasmine.createSpyObj<LoanApi>(
      'LoanApi',
      ['createLoan']
    );

    api.createLoan.and.returnValue(of(mockLoan));

    await TestBed.configureTestingModule({
      imports: [LoanFormComponent],
      providers: [
        { provide: LoanApi, useValue: api },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoanFormComponent);
    component = fixture.componentInstance;
  });

  it('refuse un montant nul', () => {
    component.amount = 0;
    component.submitLoan();

    expect(component.error).toBe(
      'Le montant doit être supérieur à 0.'
    );
    expect(api.createLoan).not.toHaveBeenCalled();
  });

  it('refuse un ratio inférieur à 1', () => {
    component.liquidationRatio = 0.9;
    component.submitLoan();

    expect(component.error).toBe(
      'Le ratio de garantie doit être au moins égal à 1.'
    );
    expect(api.createLoan).not.toHaveBeenCalled();
  });

  it('envoie une demande valide', () => {
    component.submitLoan();

    expect(api.createLoan).toHaveBeenCalledWith(
      jasmine.objectContaining({
        amountEur: 1000,
        collateralSymbol: 'bitcoin'
      })
    );
  });
});
