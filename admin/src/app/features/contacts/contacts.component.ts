import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AdminService } from "../../services/admin.service";

@Component({
  selector: "app-contacts-admin",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="header">
      <h2>Contact Requests</h2>
      <button type="button" (click)="load()">Refresh</button>
    </div>
    <div class="card" *ngFor="let item of contacts">
      <div class="row">
        <strong>{{ item.name }}</strong>
        <span class="pill" [class.done]="item.status === 'completed'">
          {{ item.status | titlecase }}
        </span>
      </div>
      <p class="message">{{ item.message }}</p>
      <div class="meta">
        <span *ngIf="item.phone">Phone: {{ item.phone }}</span>
        <span *ngIf="item.email">Email: {{ item.email }}</span>
        <span *ngIf="item.subject">| {{ item.subject }}</span>
      </div>
      <div class="row-actions">
        <label>
          Status
          <select [(ngModel)]="item.status" (change)="updateStatus(item)">
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </label>
      </div>
    </div>
    <p class="status" *ngIf="!contacts.length">No contact requests yet.</p>
  `,
  styles: [
    `
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      }
      button {
        background: var(--accent);
        color: white;
        border: none;
        padding: 8px 12px;
        border-radius: 8px;
        cursor: pointer;
      }
      .card {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 12px;
      }
      .row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
      }
      .pill {
        background: #fef3c7;
        color: #92400e;
        padding: 4px 10px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 600;
      }
      .pill.done {
        background: #dcfce7;
        color: #166534;
      }
      .message {
        margin: 8px 0;
        color: var(--text);
      }
      .meta {
        color: var(--muted);
        font-size: 13px;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }
      .row-actions {
        margin-top: 12px;
      }
      select {
        padding: 6px 10px;
        border-radius: 8px;
        border: 1px solid #d1d5db;
      }
      label {
        display: inline-grid;
        gap: 6px;
        font-size: 12px;
      }
      .status {
        color: var(--muted);
      }
    `
  ]
})
export class ContactsComponent implements OnInit {
  contacts: any[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.adminService.getContacts().subscribe((data) => (this.contacts = data || []));
  }

  updateStatus(item: any): void {
    this.adminService.updateContactStatus(item.id, item.status).subscribe();
  }
}
