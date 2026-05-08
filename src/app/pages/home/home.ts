import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Footer } from '../../components/footer/footer';
import { Navbar } from '../../components/navbar/navbar';
import { Api } from '../../services/api';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    RouterModule,
    Footer,
    Navbar
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  heroImage: string = '/assets/hero.jpg';
  portfolioItems: any[] = [];

  constructor(private api: Api) { }

  ngOnInit() {
    this.loadHeroImage();
    this.loadPortfolio();
  }

  loadHeroImage() {
    this.api.getHeroImage().subscribe({
      next: (response) => {
        if (response && response.image_data) {
          this.heroImage = response.image_data;
        }
      },
      error: (err) => console.error('Erro ao carregar hero:', err)
    });
  }

  loadPortfolio() {
    this.api.getPortfolio().subscribe({
      next: (response) => {
        this.portfolioItems = response;
      },
      error: (err) => console.error('Erro ao carregar portfólio:', err)
    });
  }
}
