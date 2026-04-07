import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { HealthCheckService } from './health-check.service';
import { environment } from '../../../environments/environment';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('HealthCheckService', () => {
  let service: HealthCheckService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should set isApiReady to true on successful check', () => {
    service = TestBed.inject(HealthCheckService);
    httpMock = TestBed.inject(HttpTestingController);

    const req = httpMock.expectOne(environment.apiUrl + '/health');
    expect(req.request.method).toBe('GET');
    req.flush('OK');

    expect(service.isApiReady()).toBe(true);
  });

  it('should handle error and retry, ultimately returning null', fakeAsync(() => {
    service = TestBed.inject(HealthCheckService);
    httpMock = TestBed.inject(HttpTestingController);

    for (let i = 0; i < 21; i++) {
      const req = httpMock.expectOne(environment.apiUrl + '/health');
      req.flush('Error', { status: 500, statusText: 'Server Error' });
      tick(3000);
    }

    expect(service.isApiReady()).toBe(false);
  }));
});
