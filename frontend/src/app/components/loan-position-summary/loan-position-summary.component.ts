import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LoanPositionApi, LoanPositionSummary } from '../../services/loan-position.api';

@Component({
  selector: 'app-loan-position-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loan-position-summary.component.html',
  styleUrls: ['./loan-position-summary.component.css'],
})
export class LoanPositionSummaryComponent implements OnInit {
  summary: LoanPositionSummary | null = null;
  loading = false;
  error: string | null = null;

  constructor(private loanPositionApi: LoanPositionApi) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;

    this.loanPositionApi.getSummary().subscribe({
      next: (summary) => {
        this.summary = summary;
        this.loading = false;
      },
      error: () => {
        this.summary = null;
        this.error = 'Impossible de charger le résumé du portefeuille.';
        this.loading = false;
      },
    });
  }
}
