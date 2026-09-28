import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { LoanPositionApi, LoanPositionSummary } from '../../services/loan-position.api';
import { LoanPositionSummaryComponent } from './loan-position-summary.component';

describe('LoanPositionSummaryComponent', () => {
  let api: LoanPositionApi;

  const summary: LoanPositionSummary = {
    totalLoans: 3,
    pendingLoans: 1,
    approvedLoans: 1,
    liquidatedLoans: 1,
    totalBorrowedEur: 3200,
    outstandingEur: 2000,
    collateralByCrypto: [
      { symbol: 'BTC', quantity: 0.35 },
      { symbol: 'ETH', quantity: 1.5 },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanPositionSummaryComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    api = TestBed.inject(LoanPositionApi);
  });

  function createFixture(): ComponentFixture<LoanPositionSummaryComponent> {
    const fixture = TestBed.createComponent(LoanPositionSummaryComponent);
    fixture.detectChanges();
    return fixture;
  }

  it('calls the API and displays the portfolio data', () => {
    const getSummary = spyOn(api, 'getSummary').and.returnValue(of(summary));

    const fixture = createFixture();
    const text = fixture.nativeElement.textContent as string;

    expect(getSummary).toHaveBeenCalledTimes(1);
    expect(text).toContain('Résumé du portefeuille');
    expect(text).toContain('3');
    expect(text).toContain('BTC');
    expect(text).toContain('ETH');
  });

  it('displays an empty state for a portfolio without loans', () => {
    spyOn(api, 'getSummary').and.returnValue(of({
      ...summary,
      totalLoans: 0,
      pendingLoans: 0,
      approvedLoans: 0,
      liquidatedLoans: 0,
      totalBorrowedEur: 0,
      outstandingEur: 0,
      collateralByCrypto: [],
    }));

    const fixture = createFixture();

    expect(fixture.nativeElement.textContent).toContain('Votre portefeuille est vide');
  });

  it('displays an error state when the API fails', () => {
    spyOn(api, 'getSummary').and.returnValue(throwError(() => new Error('network')));

    const fixture = createFixture();

    expect(fixture.nativeElement.textContent).toContain('Résumé indisponible');
    expect(fixture.nativeElement.textContent).toContain('Impossible de charger le résumé du portefeuille.');
  });
});
