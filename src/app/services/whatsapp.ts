import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Whatsapp {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  // Buscar WhatsApp do admin
  getAdminWhatsapp(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/whatsapp`);
  }

  // Atualizar WhatsApp do admin
  updateAdminWhatsapp(whatsapp: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/whatsapp`, { whatsapp });
  }

  // Verificar status da conexão do WhatsApp
  getWhatsAppStatus(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/whatsapp-status`);
  }
}
