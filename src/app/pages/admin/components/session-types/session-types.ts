import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../../../../services/api';

@Component({
  selector: 'app-session-types',
  imports: [CommonModule, FormsModule],
  templateUrl: './session-types.html',
  styleUrl: './session-types.css',
})
export class SessionTypes implements OnInit {
  sessionTypes: any[] = [];
  isLoading = true;
  showModal = false;
  editingItem: any = null;
  isSaving = false;
  saveError = '';

  value = '';
  label = '';
  description = '';
  icon = '';
  isActive = true;

  constructor(private api: Api) { }

  ngOnInit() {
    this.loadSessionTypes();
  }

  loadSessionTypes() {
    this.isLoading = true;
    this.api.getAdminSessionTypes().subscribe({
      next: (response) => {
        this.sessionTypes = response;
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
    this.value = '';
    this.label = '';
    this.description = '';
    this.icon = '';
    this.isActive = true;
    this.saveError = '';
    this.showModal = true;
  }

  openEditModal(item: any) {
    this.editingItem = item;
    this.value = item.value;
    this.label = item.label;
    this.description = item.description || '';
    this.icon = item.icon || '';
    this.isActive = item.is_active;
    this.saveError = '';
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingItem = null;
  }

  saveItem() {
    if (!this.value) {
      this.saveError = 'Value é obrigatório (ex: casal, familia)';
      return;
    }
    if (!this.label) {
      this.saveError = 'Label é obrigatório (ex: Casal, Família)';
      return;
    }

    this.isSaving = true;
    const itemData = {
      value: this.value.toLowerCase().trim(),
      label: this.label,
      description: this.description,
      icon: this.icon,
      is_active: this.isActive
    };

    if (this.editingItem) {
      this.api.updateSessionType(this.editingItem.id, itemData).subscribe({
        next: () => {
          this.isSaving = false;
          this.closeModal();
          this.loadSessionTypes();
        },
        error: (err) => {
          console.error('Erro:', err);
          this.isSaving = false;
          this.saveError = 'Erro ao salvar. Tente novamente.';
        }
      });
    } else {
      this.api.addSessionType(itemData).subscribe({
        next: () => {
          this.isSaving = false;
          this.closeModal();
          this.loadSessionTypes();
        },
        error: (err) => {
          console.error('Erro:', err);
          this.isSaving = false;
          this.saveError = 'Erro ao adicionar. Pode ser que este value já exista.';
        }
      });
    }
  }

  deleteItem(id: number) {
    if (confirm('Tem certeza que deseja remover este tipo de ensaio?')) {
      this.api.deleteSessionType(id).subscribe({
        next: () => {
          this.loadSessionTypes();
        },
        error: (err) => console.error('Erro:', err)
      });
    }
  }

  toggleActive(item: any) {
    const newStatus = !item.is_active;
    this.api.updateSessionType(item.id, { ...item, is_active: newStatus }).subscribe({
      next: () => {
        item.is_active = newStatus;
      },
      error: (err) => console.error('Erro:', err)
    });
  }

  moveUp(index: number) {
    if (index === 0) return;
    const item = this.sessionTypes[index];
    const prevItem = this.sessionTypes[index - 1];
    const tempOrder = item.display_order;
    item.display_order = prevItem.display_order;
    prevItem.display_order = tempOrder;
    this.sessionTypes[index] = prevItem;
    this.sessionTypes[index - 1] = item;
    this.saveOrder();
  }

  moveDown(index: number) {
    if (index === this.sessionTypes.length - 1) return;
    const item = this.sessionTypes[index];
    const nextItem = this.sessionTypes[index + 1];
    const tempOrder = item.display_order;
    item.display_order = nextItem.display_order;
    nextItem.display_order = tempOrder;
    this.sessionTypes[index] = nextItem;
    this.sessionTypes[index + 1] = item;
    this.saveOrder();
  }

  saveOrder() {
    const items = this.sessionTypes.map((item, idx) => ({
      id: item.id,
      display_order: idx
    }));
    this.api.reorderSessionTypes(items).subscribe({
      next: () => console.log('Ordem salva'),
      error: (err) => console.error('Erro ao salvar ordem:', err)
    });
  }
}
