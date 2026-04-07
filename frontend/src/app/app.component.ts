import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HealthCheckService } from './core/services/health-check.service';
import { ApiLoadingComponent } from './shared/components/api-loading/api-loading.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ApiLoadingComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  healthCheckService = inject(HealthCheckService);
}
