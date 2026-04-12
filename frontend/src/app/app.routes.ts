import { Routes } from '@angular/router';
import { AuthGuard } from './common/guards/auth-guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { Login } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { TasksComponent } from './pages/tasks/tasks';
import { UsersComponent } from './pages/users/users';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'tasks', component: TasksComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];