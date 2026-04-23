import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

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

  constructor(private http: HttpClient) {}

  ngOnInit() { this.loadLogs(); }

  loadLogs() {
    let params = new URLSearchParams();
    if (this.filterPath) params.append('path', this.filterPath);
    if (this.filterStatus) params.append('statusCode', this.filterStatus);
    if (this.filterFrom) params.append('from', this.filterFrom);
    if (this.filterTo) params.append('to', this.filterTo);

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
    this.loadLogs();
  }
}