import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { LoanApi, Loan, ContractProof } from '../../services/loan.api';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-loan-list',
  templateUrl: './loan-list.component.html',
  styleUrls: ['./loan-list.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class LoanListComponent implements OnInit, OnDestroy {
  loans: Loan[] = [];
  loading = false;
  error: string | null = null;
  contracts: Record<number, ContractProof> = {};
  actionMessage = '';

  private sub = new Subscription();

  constructor(private loanApi: LoanApi, public auth: AuthService) {}

  ngOnInit(): void {
    this.load();
    this.sub.add(this.loanApi.refreshEvents().subscribe(() => this.load()));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  load() {
    this.loading = true;
    this.error = null;
    const source = this.auth.hasRole('ROLE_ADMIN') ? this.loanApi.listAllLoans() : this.loanApi.listLoans();
    source.subscribe({
      next: (loans) => {
        this.loans = loans;
        this.loading = false;
      },
      error: () => {
        this.error = "Impossible de charger les prêts";
        this.loading = false;
      },
    });
  }

  approve(id: number) { this.loanApi.approve(id).subscribe({next:()=>{this.actionMessage=`Prêt #${id} approuvé et contrat généré.`;this.load();},error:e=>this.error=e?.error?.detail??"Approbation impossible"}); }
  showContract(id: number) { this.loanApi.contract(id).subscribe({next:c=>this.contracts[id]=c,error:e=>this.error=e?.error?.detail??"Contrat indisponible"}); }
  signUser(id: number) { this.loanApi.signUser(id).subscribe({next:c=>{this.contracts[id]=c;this.actionMessage='Signature utilisateur enregistrée.';},error:e=>this.error=e?.error?.detail??"Signature impossible"}); }
  signAdmin(id: number) { this.loanApi.signAdmin(id).subscribe({next:c=>{this.contracts[id]=c;this.actionMessage='Contresignature administrateur enregistrée.';},error:e=>this.error=e?.error?.detail??"Signature impossible"}); }
  download(id: number) { this.loanApi.downloadContract(id).subscribe(blob=>{const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`contrat-pret-${id}.txt`;a.click();URL.revokeObjectURL(url);}); }
}
