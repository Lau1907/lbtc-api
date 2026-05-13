import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-logs',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './logs.html',
  styleUrl: './logs.css'
})
export class LogsComponent implements OnInit {

  logs: any[] = [];
  filteredLogs: any[] = [];
  filterPath = '';
  filterStatus = '';
  filterFrom = '';
  filterTo = '';
  currentUser: any = null;
  isAdmin = false;
  filterUsername = '';

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    this.currentUser = this.auth.getCurrentUser();
    this.isAdmin = this.auth.isAdmin();
    this.loadLogs();
  }

  loadLogs() {
    const params = new URLSearchParams();
    if (this.filterPath)     params.append('path', this.filterPath);
    if (this.filterStatus)   params.append('statusCode', this.filterStatus);
    if (this.filterFrom)     params.append('from', this.filterFrom);
    if (this.filterTo)       params.append('to', this.filterTo);
    if (this.filterUsername) params.append('username', this.filterUsername);

    this.http.get<any[]>(`/api/logs?${params.toString()}`).subscribe({
      next: (data) => { 
        this.logs = data; 
        this.cdr.detectChanges();
      },
      error: (err)  => { console.error('Error al cargar logs:', err); }
    });
  }

  getStatusClass(status: number): string {
    if (status >= 500) return 'badge-error';
    if (status >= 400) return 'badge-warning';
    return 'badge-success';
  }

  clearFilters() {
    this.filterPath     = '';
    this.filterStatus   = '';
    this.filterFrom     = '';
    this.filterTo       = '';
    this.filterUsername = '';
    this.loadLogs();
  }

  clearAllLogsFromDB() {
  if (confirm('¿Estás seguro de que deseas eliminar todos los logs de la base de datos?')) {
    this.http.delete('/api/logs').subscribe({
      next: () => {
        alert('Logs eliminados');
        this.loadLogs(); 
      },
      error: (err) => console.error('Error al eliminar logs:', err)
    });
  }
}

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}