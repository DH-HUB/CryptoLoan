import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoanApi, CreateLoanRequest } from '../../services/loan.api';

@Component({
  selector: 'app-loan-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './loan-form.component.html',
  styleUrls: ['./loan-form.component.css'],
})
export class LoanFormComponent {
  amount: number = 1000;
  liquidationRatio: number = 1.5;

  collateralCryptoType: string = 'bitcoin';
  collateralCryptoAmount: number = 0.1;

  isSubmitting = false;
  error: string | null = null;

  constructor(private loanApi: LoanApi) {}

  submitLoan() {
    this.error = null;
    if (this.amount <= 0) { this.error = 'Le montant doit être supérieur à 0.'; return; }
    if (this.liquidationRatio < 1) { this.error = 'Le ratio de garantie doit être au moins égal à 1.'; return; }
    if (!this.collateralCryptoType.trim()) { this.error = 'La crypto de garantie est obligatoire.'; return; }
    if (this.collateralCryptoAmount <= 0) { this.error = 'La quantité déposée doit être supérieure à 0.'; return; }
    const req: CreateLoanRequest = {
      amountEur: this.amount,
      liquidationRatio: this.liquidationRatio,
      collateralSymbol: this.collateralCryptoType,
      collateralAmount: this.collateralCryptoAmount,
    };

    this.isSubmitting = true;
    this.loanApi.createLoan(req).subscribe({
      next: () => {
        this.isSubmitting = false;
      },
      error: (e) => {
        this.isSubmitting = false;
        this.error = e?.error?.detail ?? "Erreur lors de la création du prêt";
      },
    });
  }
}
