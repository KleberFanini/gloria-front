import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../../../../services/api';

@Component({
  selector: 'app-whatsapp-settings',
  imports: [CommonModule, FormsModule],
  templateUrl: './whatsapp-settings.html',
  styleUrl: './whatsapp-settings.css',
})
export class WhatsappSettings implements OnInit {
  whatsapp: string = '';
  isLoading = true;
  isSaving = false;
  saveMessage = '';
  saveMessageType: 'success' | 'error' = 'success';
  status: string = 'Verificando...';
  isConnected = false;

  constructor(private api: Api) { }

  ngOnInit() {
    this.loadWhatsapp();
    this.checkWhatsAppStatus();
  }

  loadWhatsapp() {
    this.isLoading = true;
    this.api.getAdminWhatsapp().subscribe({
      next: (response) => {
        if (response && response.whatsapp) {
          this.whatsapp = this.formatWhatsApp(response.whatsapp);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro:', err);
        this.isLoading = false;
      }
    });
  }

  checkWhatsAppStatus() {
    this.api.getWhatsAppStatus().subscribe({
      next: (response) => {
        if (response && response.connected) {
          this.isConnected = true;
          this.status = '✅ Conectado';
        } else {
          this.isConnected = false;
          this.status = '❌ Desconectado';
        }
      },
      error: (err) => {
        console.error('Erro ao verificar status:', err);
        this.status = '⚠️ Não disponível';
        this.isConnected = false;
      }
    });
  }

  formatWhatsApp(raw: string): string {
    if (!raw) return '';
    const numbers = raw.replace(/\D/g, '');

    if (numbers.length === 11) {
      // Celular: (XX) XXXXX-XXXX
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (numbers.length === 10) {
      // Fixo: (XX) XXXX-XXXX
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }

    return numbers;
  }

  onWhatsAppInput(value: string) {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    this.whatsapp = this.formatWhatsApp(numbers);
  }

  isValidWhatsApp(): boolean {
    const numbers = this.whatsapp.replace(/\D/g, '');
    return numbers.length === 10 || numbers.length === 11;
  }

  saveWhatsapp() {
    if (!this.whatsapp) {
      this.showMessage('Digite um número de WhatsApp', 'error');
      return;
    }

    if (!this.isValidWhatsApp()) {
      this.showMessage('Número inválido. Use (DDD) + número com 8 ou 9 dígitos', 'error');
      return;
    }

    this.isSaving = true;
    const numbersOnly = this.whatsapp.replace(/\D/g, '');

    this.api.updateAdminWhatsapp(numbersOnly).subscribe({
      next: () => {
        this.showMessage('WhatsApp configurado com sucesso!', 'success');
        this.isSaving = false;
      },
      error: (err) => {
        console.error('Erro:', err);
        this.showMessage('Erro ao salvar. Tente novamente.', 'error');
        this.isSaving = false;
      }
    });
  }

  showMessage(msg: string, type: 'success' | 'error') {
    this.saveMessage = msg;
    this.saveMessageType = type;
    setTimeout(() => {
      this.saveMessage = '';
    }, 5000);
  }
}
