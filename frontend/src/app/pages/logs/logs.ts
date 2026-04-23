import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
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

  constructor(private http: HttpClient, private auth: AuthService) {}

  ngOnInit() {
    this.currentUser = this.auth.getCurrentUser();
    this.isAdmin = this.auth.isAdmin();
    this.loadLogs();
  }

  loadLogs() {
    let params = new URLSearchParams();
    if (this.filterPath) params.append('path', this.filterPath);
    if (this.filterStatus) params.append('statusCode', this.filterStatus);
    if (this.filterFrom) params.append('from', this.filterFrom);
    if (this.filterTo) params.append('to', this.filterTo);
  if (this.filterUsername) params.append('username', this.filterUsername); 


    this.http.get<any[]>(`/api/logs?${params.toString()}`).subscribe(data => {
      this.logs = data;
    });
  }

  getStatusClass(status: number): string {
    if (status >= 500) return 'badge-error';
    if (status >= 400) return 'badge-warning';
    return 'badge-success';
  }

  clearFilters() {
    this.filterPath = '';
    this.filterStatus = '';
    this.filterFrom = '';
    this.filterTo = '';
    this.filterUsername= '';
    this.loadLogs();
  }
}