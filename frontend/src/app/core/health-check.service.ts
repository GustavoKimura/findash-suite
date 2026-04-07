import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { of } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HealthCheckService {
  private http = inject(HttpClient);
  private healthCheckUrl = environment.apiUrl + '/health';

  public isApiReady = signal<boolean>(false);

  constructor() {
    this.checkApiStatus();
  }

  private checkApiStatus(): void {
    this.http
      .get(this.healthCheckUrl, { responseType: 'text' })
      .pipe(
        tap(() => this.isApiReady.set(true)),
        retry({
          count: 20,
          delay: 3000,
        }),
        catchError((error) => {
          console.error('API is not responding after multiple retries.', error);
          return of(null);
        }),
      )
      .subscribe();
  }
}
