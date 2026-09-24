import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { CryptoService } from '../../services/crypto.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent {

  cryptoPrices: { [key: string]: number } = {};

  constructor(private cryptoService: CryptoService) {}

  ngOnInit(): void {
    forkJoin({
      bitcoin: this.cryptoService.getCryptoPriceEur('bitcoin'),
      ethereum: this.cryptoService.getCryptoPriceEur('ethereum'),
      litecoin: this.cryptoService.getCryptoPriceEur('litecoin'),
    }).subscribe({
      next: (prices) => {
        this.cryptoPrices = prices;
      },
      error: (error) => {
        console.error(
          'Erreur lors de la récupération des prix des cryptomonnaies :',
          error
        );
      },
    });
  }
}
