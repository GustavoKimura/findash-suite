import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { CurrencyMaskDirective } from '../../shared/directives/currency-mask.directive';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { DashboardViewModel } from './dashboard.viewmodel';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BaseChartDirective,
    ModalComponent,
    CurrencyMaskDirective,
  ],
  providers: [DashboardViewModel],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  public vm = inject(DashboardViewModel);
}
