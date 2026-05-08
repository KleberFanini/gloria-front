import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Footer } from '../../components/footer/footer';
import { Navbar } from '../../components/navbar/navbar';
import { Api } from '../../services/api';

interface SessionType {
  id?: number;
  value: string;
  label: string;
  desc: string;  // ← Mudar de 'description' para 'desc'
  is_active?: boolean;
}

interface PhotoProduct {
  value: string;
  label: string;
  desc: string;
}

interface LocationType {
  value: string;
  label: string;
  desc: string;
}

@Component({
  selector: 'app-agendamento',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    Footer,
    Navbar
  ],
  templateUrl: './agendamento.html',
  styleUrl: './agendamento.css',
})
export class Agendamento implements OnInit {
  // Tipos de ensaio - serão carregados do backend
  sessionTypes: SessionType[] = [];

  // Produtos fotográficos (fixos por enquanto)
  photoProducts: PhotoProduct[] = [
    { value: 'digital', label: 'Digital', desc: 'Arquivos em alta resolução' },
    { value: 'reveladas', label: 'Reveladas', desc: 'Fotos impressas em papel fotográfico' },
    { value: 'ambos', label: 'Ambos', desc: 'Digital + Reveladas' }
  ];

  // Tipos de local (fixos por enquanto)
  locationTypes: LocationType[] = [
    { value: 'studio', label: 'No estúdio', desc: 'Estrutura preparada e climatizada' },
    { value: 'externo', label: 'Externo', desc: 'Ar livre (parques, praças, ruas)' },
    { value: 'flexivel', label: 'A combinar', desc: 'Em casa, no trabalho ou local sugerido' }
  ];

  bookingForm: FormGroup;
  submitted = false;
  unavailableDates: Date[] = [];
  isSubmitting = false;
  minDate: Date;
  selectedDateUnavailable = false;
  isLoadingTypes = true;

  constructor(
    private fb: FormBuilder,
    private api: Api
  ) {
    this.minDate = new Date();
    this.minDate.setHours(0, 0, 0, 0);

    this.bookingForm = this.fb.group({
      client_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(120)]],
      client_email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      client_phone: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]],
      session_type: ['', Validators.required],
      photo_product: ['', Validators.required],
      location_type: ['', Validators.required],
      location_details: ['', Validators.maxLength(500)],
      preferred_date: ['', Validators.required],
      alternative_date: [''],
      notes: ['', Validators.maxLength(800)]
    });
  }

  ngOnInit() {
    document.title = 'Agendar ensaio | Lume Studio';
    this.loadSessionTypes();
    this.loadUnavailableDates();
  }

  // Carregar tipos de ensaio do backend
  loadSessionTypes() {
    this.isLoadingTypes = true;
    this.api.getSessionTypes().subscribe({
      next: (response) => {
        // Converter resposta para o formato esperado pelo template (usando 'desc')
        this.sessionTypes = response.map((item: any) => ({
          value: item.value,
          label: item.label,
          desc: item.description || item.desc || '',  // ← Usar 'desc'
          is_active: item.is_active
        }));
        this.isLoadingTypes = false;
      },
      error: (err) => {
        console.error('❌ Erro ao carregar tipos de ensaio:', err);
        // Fallback para tipos padrão
        this.sessionTypes = [
          { value: 'casal', label: 'Casal', desc: 'Ensaios românticos a dois' },
          { value: 'familia', label: 'Família', desc: 'Pais, filhos, avós' },
          { value: 'individual', label: 'Individual', desc: 'Retrato autoral' },
          { value: 'gestante', label: 'Gestante', desc: 'Espera & maternidade' },
          { value: 'aniversario', label: 'Aniversário', desc: 'Celebrações íntimas' },
          { value: 'evento', label: 'Evento', desc: 'Casamentos, formaturas' }
        ];
        this.isLoadingTypes = false;
      }
    });
  }

  loadUnavailableDates() {
    this.api.getUnavailableDates().subscribe({
      next: (response) => {
        if (response && Array.isArray(response)) {
          this.unavailableDates = response.map((item: any) => new Date(item.date));
        }
      },
      error: (err) => {
        console.error('Erro ao carregar datas indisponíveis:', err);
        this.unavailableDates = [];
      }
    });
  }

  checkDateAvailability() {
    const date = this.bookingForm.get('preferred_date')?.value;
    if (date) {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      const isUnavailable = this.unavailableDates.some(d =>
        d.getFullYear() === dateObj.getFullYear() &&
        d.getMonth() === dateObj.getMonth() &&
        d.getDate() === dateObj.getDate()
      );

      this.selectedDateUnavailable = isUnavailable;

      if (isUnavailable) {
        this.bookingForm.get('preferred_date')?.setErrors({ 'unavailable': true });
      } else {
        const errors = this.bookingForm.get('preferred_date')?.errors;
        if (errors) {
          delete errors['unavailable'];
          if (Object.keys(errors).length === 0) {
            this.bookingForm.get('preferred_date')?.setErrors(null);
          }
        }
      }
    }
  }

  isDateDisabled(date: Date): boolean {
    date.setHours(0, 0, 0, 0);
    if (date < this.minDate) return true;

    return this.unavailableDates.some(d =>
      d.getFullYear() === date.getFullYear() &&
      d.getMonth() === date.getMonth() &&
      d.getDate() === date.getDate()
    );
  }

  formatDate(date: any): string {
    if (!date) return '';

    // Se for string, converte para Date
    let dateObj: Date;
    if (typeof date === 'string') {
      dateObj = new Date(date);
    } else if (date instanceof Date) {
      dateObj = date;
    } else {
      return '';
    }

    // Verificar se é uma data válida
    if (isNaN(dateObj.getTime())) {
      return '';
    }

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // No onSubmit, ajuste a preparação dos dados:
  onSubmit() {
    if (this.bookingForm.valid) {
      this.isSubmitting = true;

      const formValues = this.bookingForm.value;

      // Preparar dados para enviar ao backend
      const formData = {
        client_name: formValues.client_name,
        client_email: formValues.client_email,
        client_phone: formValues.client_phone,
        session_type: formValues.session_type,
        photo_product: formValues.photo_product,
        location_type: formValues.location_type,
        location_details: formValues.location_details || null,
        preferred_date: this.formatDate(formValues.preferred_date),
        alternative_date: formValues.alternative_date ? this.formatDate(formValues.alternative_date) : null,
        notes: formValues.notes || null
      };

      console.log('📤 Enviando dados:', formData);

      this.api.createBooking(formData).subscribe({
        next: (response) => {
          console.log('✅ Agendamento criado:', response);
          this.isSubmitting = false;
          this.submitted = true;
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        error: (error) => {
          console.error('❌ Erro ao criar agendamento:', error);
          this.isSubmitting = false;
          let errorMessage = 'Erro ao enviar. Tente novamente.';
          if (error.error?.error) {
            errorMessage = error.error.error;
          }
          alert(errorMessage);
        }
      });
    } else {
      Object.keys(this.bookingForm.controls).forEach(key => {
        this.bookingForm.get(key)?.markAsTouched();
      });
      alert('Por favor, preencha todos os campos obrigatórios.');
    }
  }

  selectSessionType(value: string) {
    this.bookingForm.patchValue({ session_type: value });
    this.bookingForm.get('session_type')?.markAsTouched();
  }

  selectPhotoProduct(value: string) {
    this.bookingForm.patchValue({ photo_product: value });
    this.bookingForm.get('photo_product')?.markAsTouched();
  }

  selectLocationType(value: string) {
    this.bookingForm.patchValue({ location_type: value });
    this.bookingForm.get('location_type')?.markAsTouched();
  }
}