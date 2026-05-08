import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Api {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  healthCheck(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password });
  }

  createBooking(bookingData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/bookings`, bookingData);
  }

  getUnavailableDates(): Observable<any> {
    return this.http.get(`${this.apiUrl}/bookings/unavailable-dates`);
  }

  getAllBookings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/bookings`);
  }

  updateBookingStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/bookings/${id}/status`, { status });
  }

  blockDate(date: string, reason?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/unavailable-dates`, { date, reason });
  }

  unblockDate(date: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/unavailable-dates/${date}`);
  }

  getHeroImage(): Observable<any> {
    return this.http.get(`${this.apiUrl}/hero`);
  }

  uploadHeroImage(imageData: string, altText: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/hero`, { image: imageData, alt_text: altText });
  }
}