import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Agendamento } from './pages/agendamento/agendamento';
import { Admin } from './pages/admin/admin';
import { authGuard } from './guards/auth-guard';
import { Login } from './pages/login/login';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'agendamento', component: Agendamento },
    { path: 'admin', component: Admin, canActivate: [authGuard] },
    { path: 'login', component: Login },
    { path: '**', redirectTo: '' }
];
