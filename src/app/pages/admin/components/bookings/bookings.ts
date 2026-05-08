import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api } from '../../../../services/api';

@Component({
  selector: 'app-bookings',
  imports: [CommonModule],
  templateUrl: './bookings.html',
  styleUrl: './bookings.css',
})
export class Bookings {
  bookings: any[] = [];
  selectedBooking: any = null;

  constructor(private api: Api) { }

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.api.getAllBookings().subscribe({
      next: (res) => {
        this.bookings = res.bookings;
      },
      error: (err) => console.error(err)
    });
  }

  viewDetails(booking: any) {
    this.selectedBooking = booking;
  }

  closeModal() {
    this.selectedBooking = null;
  }

  updateStatus(id: number, status: string) {
    this.api.updateBookingStatus(id, status).subscribe({
      next: () => {
        this.loadBookings();
        this.closeModal();
      },
      error: (err) => console.error(err)
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 px-2 py-0.5 text-xs rounded';
      case 'confirmed': return 'bg-green-100 text-green-800 px-2 py-0.5 text-xs rounded';
      case 'completed': return 'bg-blue-100 text-blue-800 px-2 py-0.5 text-xs rounded';
      case 'cancelled': return 'bg-red-100 text-red-800 px-2 py-0.5 text-xs rounded';
      default: return 'bg-gray-100 text-gray-800 px-2 py-0.5 text-xs rounded';
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
