import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Footer } from '../../components/footer/footer';
import { Navbar } from '../../components/navbar/navbar';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    RouterModule,
    Footer,
    Navbar
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  portfolioItems = [
    {
      src: '/assets/portfolio-1.jpg',
      title: 'Ensaio Casal',
      category: 'Casal',
      span: 'md:col-span-2'
    },
    {
      src: '/assets/portfolio-2.jpg',
      title: 'Família',
      category: 'Família',
      span: ''
    },
    {
      src: '/assets/portfolio-3.jpg',
      title: 'Retrato',
      category: 'Individual',
      span: ''
    },
    {
      src: '/assets/portfolio-4.jpg',
      title: 'Gestante',
      category: 'Gestante',
      span: ''
    },
    {
      src: '/assets/portfolio-5.jpg',
      title: 'Aniversário',
      category: 'Evento',
      span: ''
    },
    {
      src: '/assets/portfolio-6.jpg',
      title: 'Casamento',
      category: 'Evento',
      span: 'md:col-span-2'
    }
  ];
}
