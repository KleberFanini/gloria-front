import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Footer } from '../../components/footer/footer';
import { Navbar } from '../../components/navbar/navbar';

interface SessionType {
  value: string;
  label: string;
  desc: string;
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
export class Agendamento {
  sessionTypes: SessionType[] = [
    { value: 'casal', label: 'Casal', desc: 'Ensaios românticos a dois' },
    { value: 'familia', label: 'Família', desc: 'Pais, filhos, avós' },
    { value: 'individual', label: 'Individual', desc: 'Retrato autoral' },
    { value: 'gestante', label: 'Gestante', desc: 'Espera & maternidade' },
    { value: 'aniversario', label: 'Aniversário', desc: 'Celebrações íntimas' },
    { value: 'evento', label: 'Evento', desc: 'Casamentos, formaturas' }
  ];

  photoProducts: PhotoProduct[] = [
    { value: 'digital', label: 'Digital', desc: 'Arquivos em alta resolução' },
    { value: 'reveladas', label: 'Reveladas', desc: 'Fotos impressas em papel fotográfico' },
    { value: 'ambos', label: 'Ambos', desc: 'Digital + Reveladas' }
  ];

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

  constructor(private fb: FormBuilder) {
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
    this.loadUnavailableDates();
  }

  loadUnavailableDates() {
    this.unavailableDates = [];
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

  onSubmit() {
    if (this.bookingForm.valid) {
      this.isSubmitting = true;

      // Simular envio - substituir pela chamada real do Supabase
      setTimeout(() => {
        console.log('Form values:', this.bookingForm.value);
        this.isSubmitting = false;
        this.submitted = true;
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Exemplo de chamada real:
        // this.supabase.from('booking_requests').insert({
        //   client_name: this.bookingForm.value.client_name,
        //   client_email: this.bookingForm.value.client_email,
        //   client_phone: this.bookingForm.value.client_phone,
        //   session_type: this.bookingForm.value.session_type,
        //   preferred_date: this.formatDate(this.bookingForm.value.preferred_date),
        //   alternative_date: this.bookingForm.value.alternative_date ? 
        //     this.formatDate(this.bookingForm.value.alternative_date) : null,
        //   notes: this.bookingForm.value.notes || null,
        // });
      }, 1500);
    } else {
      Object.keys(this.bookingForm.controls).forEach(key => {
        const control = this.bookingForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
