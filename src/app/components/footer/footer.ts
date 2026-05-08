import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api } from '../../services/api';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer implements OnInit {
  currentYear = new Date().getFullYear();
  contactEmail: string = 'admin@lumestudio.com';
  isLoading: boolean = true;

  constructor(private api: Api) { }

  ngOnInit() {
    this.loadContactEmail();
  }

  loadContactEmail() {
    this.api.getContactEmail().subscribe({
      next: (response) => {
        if (response && response.email) {
          this.contactEmail = response.email;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar email:', err);
        this.isLoading = false;
      }
    });
  }
}
