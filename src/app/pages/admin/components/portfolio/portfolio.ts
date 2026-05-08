import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../../../../services/api';

@Component({
  selector: 'app-portfolio',
  imports: [CommonModule, FormsModule],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.css',
})
export class Portfolio implements OnInit {
  portfolioItems: any[] = [];
  isLoading = true;
  showModal = false;
  editingItem: any = null;
  isUploading = false;
  uploadError = '';

  // Form fields
  selectedImage: string | null = null;
  title = '';
  category = '';
  span = '';

  categories = ['Casal', 'Família', 'Individual', 'Gestante', 'Evento', 'Aniversário'];

  constructor(private api: Api) { }

  ngOnInit() {
    this.loadPortfolio();
  }

  loadPortfolio() {
    this.isLoading = true;
    this.api.getPortfolio().subscribe({
      next: (response) => {
        this.portfolioItems = response;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro:', err);
        this.isLoading = false;
      }
    });
  }

  openAddModal() {
    this.editingItem = null;
    this.selectedImage = null;
    this.title = '';
    this.category = '';
    this.span = '';
    this.uploadError = '';
    this.showModal = true;
  }

  openEditModal(item: any) {
    this.editingItem = item;
    this.selectedImage = item.image_data;
    this.title = item.title;
    this.category = item.category;
    this.span = item.span || '';
    this.uploadError = '';
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedImage = null;
    this.editingItem = null;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.uploadError = '';

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      this.uploadError = 'Imagem muito grande. Máximo 5MB.';
      return;
    }

    if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
      this.uploadError = 'Formato inválido. Use JPG ou PNG.';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.selectedImage = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  saveItem() {
    if (!this.selectedImage && !this.editingItem) {
      this.uploadError = 'Selecione uma imagem';
      return;
    }
    if (!this.title) {
      this.uploadError = 'Título é obrigatório';
      return;
    }
    if (!this.category) {
      this.uploadError = 'Categoria é obrigatória';
      return;
    }

    this.isUploading = true;
    const itemData = {
      image_data: this.selectedImage,
      title: this.title,
      category: this.category,
      span: this.span
    };

    if (this.editingItem) {
      this.api.updatePortfolioItem(this.editingItem.id, itemData).subscribe({
        next: () => {
          this.isUploading = false;
          this.closeModal();
          this.loadPortfolio();
        },
        error: (err) => {
          console.error('Erro:', err);
          this.isUploading = false;
          this.uploadError = 'Erro ao salvar. Tente novamente.';
        }
      });
    } else {
      this.api.addPortfolioItem(itemData).subscribe({
        next: () => {
          this.isUploading = false;
          this.closeModal();
          this.loadPortfolio();
        },
        error: (err) => {
          console.error('Erro:', err);
          this.isUploading = false;
          this.uploadError = 'Erro ao adicionar. Tente novamente.';
        }
      });
    }
  }

  deleteItem(id: number) {
    if (confirm('Tem certeza que deseja remover este item?')) {
      this.api.deletePortfolioItem(id).subscribe({
        next: () => {
          this.loadPortfolio();
        },
        error: (err) => console.error('Erro:', err)
      });
    }
  }

  // Função para drag and drop (reordenar)
  moveUp(index: number) {
    if (index === 0) return;
    const item = this.portfolioItems[index];
    const prevItem = this.portfolioItems[index - 1];
    // Trocar display_order
    const tempOrder = item.display_order;
    item.display_order = prevItem.display_order;
    prevItem.display_order = tempOrder;
    this.portfolioItems[index] = prevItem;
    this.portfolioItems[index - 1] = item;
    this.saveOrder();
  }

  moveDown(index: number) {
    if (index === this.portfolioItems.length - 1) return;
    const item = this.portfolioItems[index];
    const nextItem = this.portfolioItems[index + 1];
    const tempOrder = item.display_order;
    item.display_order = nextItem.display_order;
    nextItem.display_order = tempOrder;
    this.portfolioItems[index] = nextItem;
    this.portfolioItems[index + 1] = item;
    this.saveOrder();
  }

  saveOrder() {
    const items = this.portfolioItems.map((item, idx) => ({
      id: item.id,
      display_order: idx
    }));
    this.api.reorderPortfolioItems(items).subscribe({
      next: () => console.log('Ordem salva'),
      error: (err) => console.error('Erro ao salvar ordem:', err)
    });
  }
}
