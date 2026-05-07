import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';
import { Api } from '../../services/api';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from '../../app';
import { appConfig } from '../../app.config';
import 'zone.js';

bootstrapApplication(App, appConfig).catch(err => console.error(err));

@Component({
  selector: 'app-admin',
  imports: [
    CommonModule,
    RouterModule,
    Navbar,
    Footer
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  user: any;
  bookings: any[] = [];
  isLoading = true;

  constructor(
    private auth: Auth,
    private api: Api
  ) { }

  ngOnInit() {
    this.user = this.auth.getUser();
    this.loadBookings();
  }

  loadBookings() {
    this.isLoading = true;
    console.log('🔄 Iniciando carregamento...');

    this.api.getAllBookings().subscribe({
      next: (response) => {
        console.log('✅ Resposta recebida:', response);
        console.log('📊 Bookings recebidos:', response.bookings);
        this.bookings = response.bookings;
        this.isLoading = false;
        console.log('🔓 isLoading = false, bookings.length =', this.bookings.length);
      },
      error: (error) => {
        console.error('❌ Erro:', error);
        this.isLoading = false;
      }
    });
  }

  logout() {
    this.auth.logout();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'confirmed': return 'Confirmado';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  }
}
