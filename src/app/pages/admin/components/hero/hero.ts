import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../../../../services/api';

@Component({
  selector: 'app-hero',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero implements OnInit {
  selectedImage: string | null = null;
  currentHero: string | null = null;
  isUploading = false;
  altText = 'Foto principal do estúdio';
  uploadError: string | null = null;

  constructor(private api: Api) { }

  ngOnInit() {
    this.loadCurrentHero();
  }

  loadCurrentHero() {
    this.api.getHeroImage().subscribe({
      next: (response) => {
        if (response && response.image_data) {
          this.currentHero = response.image_data;
        }
      },
      error: (err) => console.error('Erro ao carregar hero:', err)
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.uploadError = null;

    if (!file) return;

    // Validar tamanho (max 5MB antes da compressão)
    if (file.size > 5 * 1024 * 1024) {
      this.uploadError = 'Imagem muito grande. Máximo 5MB.';
      return;
    }

    // Validar tipo
    if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
      this.uploadError = 'Formato inválido. Use JPG ou PNG.';
      return;
    }

    // Comprimir imagem antes de converter para base64
    this.compressImage(file);
  }

  compressImage(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const img = new Image();
      img.onload = () => {
        // Criar canvas para redimensionar
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Redimensionar se for muito grande (max 1920px)
        const maxWidth = 1920;
        const maxHeight = 1080;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Converter para base64 com qualidade reduzida
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        this.selectedImage = compressedDataUrl;
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  uploadImage() {
    if (!this.selectedImage) return;

    this.isUploading = true;
    this.uploadError = null;

    this.api.uploadHeroImage(this.selectedImage, this.altText).subscribe({
      next: (response) => {
        console.log('Upload realizado:', response);
        this.currentHero = this.selectedImage;
        this.selectedImage = null;
        this.isUploading = false;
        alert('Foto hero atualizada com sucesso!');
      },
      error: (err) => {
        console.error('Erro no upload:', err);
        this.isUploading = false;
        this.uploadError = 'Erro ao fazer upload. Tente novamente com uma imagem menor.';
      }
    });
  }

  cancelUpload() {
    this.selectedImage = null;
    this.uploadError = null;
  }
}

