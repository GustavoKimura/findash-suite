import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { HealthCheckService } from './health-check.service';
import { environment } from '../../environments/environment';
import { provideHttpClient } from '@angular/common/http';

describe('HealthCheckService', () => {
  let service: HealthCheckService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        HealthCheckService,
      ],
    });
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(HealthCheckService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should set isApiReady to true on successful health check', () => {
    expect(service.isApiReady()).toBe(false);
    const req = httpMock.expectOne(environment.apiUrl + '/health');
    req.flush('OK');
    expect(service.isApiReady()).toBe(true);
  });

  it('should retry on failure and eventually succeed', fakeAsync(() => {
    expect(service.isApiReady()).toBe(false);

    const req1 = httpMock.expectOne(environment.apiUrl + '/health');
    req1.flush('Error', { status: 500, statusText: 'Server Error' });
    tick(3000);

    const req2 = httpMock.expectOne(environment.apiUrl + '/health');
    req2.flush('OK');

    expect(service.isApiReady()).toBe(true);
  }));
});
