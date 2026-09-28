import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LoanPositionApi, LoanPositionSummary } from './loan-position.api';

describe('LoanPositionApi', () => {
  let api: LoanPositionApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(LoanPositionApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('calls the dedicated portfolio summary endpoint', () => {
    const response: LoanPositionSummary = {
      totalLoans: 2,
      pendingLoans: 1,
      approvedLoans: 1,
      liquidatedLoans: 0,
      totalBorrowedEur: 1500,
      outstandingEur: 1500,
      collateralByCrypto: [{ symbol: 'BTC', quantity: 0.25 }],
    };

    api.getSummary().subscribe((summary) => expect(summary).toEqual(response));

    const request = http.expectOne('/api/portfolio/summary');
    expect(request.request.method).toBe('GET');
    expect(request.request.params.keys()).toEqual([]);
    request.flush(response);
  });
});
