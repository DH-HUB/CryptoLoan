import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { ContractProof, Loan, LoanApi } from '../../services/loan.api';

type LoanStatusFilter = 'ALL' | Loan['status'];

@Component({
  selector: 'app-loan-list',
  templateUrl: './loan-list.component.html',
  styleUrls: ['./loan-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class LoanListComponent implements OnInit, OnDestroy {
  loans: Loan[] = [];
  loading = false;
  error: string | null = null;
  contracts: Record<number, ContractProof> = {};
  actionMessage = '';

  searchTerm = '';
  statusFilter: LoanStatusFilter = 'ALL';

  private sub = new Subscription();

  constructor(private loanApi: LoanApi, public auth: AuthService) {}

  ngOnInit(): void {
    this.load();
    this.sub.add(this.loanApi.refreshEvents().subscribe(() => this.load()));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  get filteredLoans(): Loan[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.loans.filter((loan) => {
      const matchesStatus = this.statusFilter === 'ALL' || loan.status === this.statusFilter;
      const matchesSearch = !term || [
        loan.id.toString(),
        loan.borrowerName,
        loan.borrowerEmail,
        loan.collateralSymbol,
      ].some((value) => value?.toLowerCase().includes(term));

      return matchesStatus && matchesSearch;
    });
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.statusFilter = 'ALL';
  }

  load(): void {
    this.loading = true;
    this.error = null;
    const source = this.auth.hasRole('ROLE_ADMIN') ? this.loanApi.listAllLoans() : this.loanApi.listLoans();
    source.subscribe({
      next: (loans) => {
        this.loans = loans;
        this.loading = false;
      },
      error: () => {
        this.error = 'Impossible de charger les prêts';
        this.loading = false;
      },
    });
  }

  approve(id: number): void {
    this.loanApi.approve(id).subscribe({
      next: () => {
        this.actionMessage = `Prêt #${id} approuvé et contrat généré.`;
        this.load();
      },
      error: (e) => this.error = e?.error?.detail ?? 'Approbation impossible',
    });
  }

  showContract(id: number): void {
    this.loanApi.contract(id).subscribe({
      next: (contract) => this.contracts[id] = contract,
      error: (e) => this.error = e?.error?.detail ?? 'Contrat indisponible',
    });
  }

  signUser(id: number): void {
    this.loanApi.signUser(id).subscribe({
      next: (contract) => {
        this.contracts[id] = contract;
        this.actionMessage = 'Signature utilisateur enregistrée.';
      },
      error: (e) => this.error = e?.error?.detail ?? 'Signature impossible',
    });
  }

  signAdmin(id: number): void {
    this.loanApi.signAdmin(id).subscribe({
      next: (contract) => {
        this.contracts[id] = contract;
        this.actionMessage = 'Contresignature administrateur enregistrée.';
      },
      error: (e) => this.error = e?.error?.detail ?? 'Signature impossible',
    });
  }

  download(id: number): void {
    this.loanApi.downloadContract(id).subscribe((blob) => {
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `contrat-pret-${id}.txt`;
      anchor.click();
      URL.revokeObjectURL(url);
    });
  }
}
