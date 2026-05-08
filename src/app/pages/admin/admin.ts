import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { Hero } from './components/hero/hero';
import { Portfolio } from './components/portfolio/portfolio';
import { Bookings } from './components/bookings/bookings';
import { SessionTypes } from './components/session-types/session-types';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from '../../app.config';
import { App } from '../../app';
import 'zone.js';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));

@Component({
  selector: 'app-admin',
  imports: [
    CommonModule,
    RouterModule,
    Navbar,
    Footer,
    Hero,
    Portfolio,
    Bookings,
    SessionTypes
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  activeTab: string = 'bookings';
  user: any;

  constructor(private auth: Auth) {
    this.user = this.auth.getUser();
  }

  logout() {
    this.auth.logout();
    window.location.href = '/login';
  }
}
