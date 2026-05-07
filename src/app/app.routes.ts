import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Agendamento } from './pages/agendamento/agendamento';
import { Admin } from './pages/admin/admin';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'agendamento', component: Agendamento },
    { path: 'admin', component: Admin },
    { path: '**', redirectTo: '' }
];
