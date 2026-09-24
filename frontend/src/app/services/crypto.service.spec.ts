import { TestBed } from '@angular/core/testing';

import { CryptoService } from './crypto.service';

import jasmine from 'jasmine';

import {provideHttpClient} from '@angular/common/http';

import {provideHttpClientTesting} from '@angular/common/http/testing';

describe('CryptoService', () => {
  let service: CryptoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(CryptoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
