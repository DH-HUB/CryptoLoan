import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Loan, LoanApi } from '../../services/loan.api';
import { LoanListComponent } from './loan-list.component';

describe('LoanListComponent', () => {
  let component: LoanListComponent;
  let fixture: ComponentFixture<LoanListComponent>;
  let loanApi: LoanApi;

  const loans: Loan[] = [
    {
      id: 1,
      borrowerEmail: 'alice@example.com',
      borrowerName: 'Alice Martin',
      amountEur: 1000,
      liquidationRatio: 1.5,
      status: 'PENDING',
      collateralSymbol: 'BTC',
      collateralAmount: 0.1,
      createdAt: '2026-09-24T10:00:00Z',
    },
    {
      id: 2,
      borrowerEmail: 'bob@example.com',
      borrowerName: 'Bob Dupont',
      amountEur: 2000,
      liquidationRatio: 1.6,
      status: 'APPROVED',
      collateralSymbol: 'ETH',
      collateralAmount: 1.2,
      createdAt: '2026-09-24T11:00:00Z',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanListComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    loanApi = TestBed.inject(LoanApi);
    const auth = TestBed.inject(AuthService);
    spyOn(auth, 'hasRole').and.returnValue(false);
    spyOn(loanApi, 'listLoans').and.returnValue(of(loans));

    fixture = TestBed.createComponent(LoanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load loans', () => {
    expect(component).toBeTruthy();
    expect(component.loans.length).toBe(2);
  });

  it('should search loans by borrower name', () => {
    component.searchTerm = 'alice';
    expect(component.filteredLoans.map((loan) => loan.id)).toEqual([1]);
  });

  it('should search loans by collateral symbol', () => {
    component.searchTerm = 'eth';
    expect(component.filteredLoans.map((loan) => loan.id)).toEqual([2]);
  });

  it('should filter loans by status', () => {
    component.statusFilter = 'APPROVED';
    expect(component.filteredLoans.map((loan) => loan.id)).toEqual([2]);
  });

  it('should combine search and status filters', () => {
    component.searchTerm = 'bob';
    component.statusFilter = 'PENDING';
    expect(component.filteredLoans).toEqual([]);
  });

  it('should reset search and status filters', () => {
    component.searchTerm = 'alice';
    component.statusFilter = 'PENDING';

    component.resetFilters();

    expect(component.searchTerm).toBe('');
    expect(component.statusFilter).toBe('ALL');
    expect(component.filteredLoans.length).toBe(2);
  });
});
