import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HealthCheckService } from './core/health-check.service';
import { ApiLoadingComponent } from './shared/api-loading/api-loading.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ApiLoadingComponent],
  template: `
    @if (healthCheckService.isApiReady()) {
      <router-outlet />
    } @else {
      <app-api-loading />
    }
  `,
})
export class AppComponent {
  healthCheckService = inject(HealthCheckService);
}
