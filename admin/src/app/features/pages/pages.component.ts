import { Component, OnInit } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { Router } from "@angular/router";
import { AdminService } from "../../services/admin.service";

@Component({
  selector: "app-pages",
  standalone: true,
  imports: [CommonModule, DatePipe],
  template: `
    <div class="header">
      <div>
        <h2>Pages</h2>
        <p class="hint">Create dynamic pages that render from reusable sections.</p>
      </div>
      <button type="button" (click)="create()">New Page</button>
    </div>
    <div class="table" *ngIf="pages.length; else empty">
      <div class="row head">
        <span>Title</span>
        <span>Slug</span>
        <span>Status</span>
        <span>Updated</span>
        <span></span>
      </div>
      <div class="row" *ngFor="let page of pages">
        <span>{{ page.title }}</span>
        <span class="mono">/pages/{{ page.slug }}</span>
        <span>
          <span class="status" [class.off]="!page.status">{{ page.status ? "Live" : "Draft" }}</span>
        </span>
        <span>{{ page.updatedAt | date: "mediumDate" }}</span>
        <span>
          <button type="button" class="ghost" (click)="edit(page.id)">Edit</button>
        </span>
      </div>
    </div>
    <ng-template #empty>
      <div class="empty">
        <h3>No pages yet</h3>
        <p>Start by creating a new dynamic page for your website.</p>
      </div>
    </ng-template>
  `,
  styles: [
    `
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }
      .hint {
        margin: 6px 0 0;
        color: var(--muted);
      }
      button {
        background: var(--accent);
        color: white;
        border: none;
        padding: 8px 12px;
        border-radius: 8px;
        cursor: pointer;
      }
      .table {
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        overflow: hidden;
        background: white;
      }
      .row {
        display: grid;
        grid-template-columns: 1.4fr 1.4fr 0.8fr 1fr auto;
        gap: 12px;
        padding: 12px 16px;
        align-items: center;
        border-bottom: 1px solid #e5e7eb;
      }
      .row:last-child {
        border-bottom: none;
      }
      .row.head {
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.6px;
        color: var(--muted);
        background: #f9fafb;
      }
      .mono {
        font-family: "SFMono-Regular", ui-monospace, "SF Mono", Menlo, Consolas, monospace;
        color: var(--muted);
      }
      .status {
        display: inline-flex;
        padding: 4px 10px;
        border-radius: 999px;
        background: #dcfce7;
        color: #166534;
        font-size: 12px;
      }
      .status.off {
        background: #fee2e2;
        color: #991b1b;
      }
      .ghost {
        background: transparent;
        border: 1px solid #e5e7eb;
        color: #111827;
      }
      .empty {
        border: 1px dashed #d1d5db;
        border-radius: 12px;
        padding: 24px;
        text-align: center;
        background: #fafafa;
      }
    `
  ]
})
export class PagesComponent implements OnInit {
  pages: any[] = [];

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.adminService.listPages().subscribe((data) => {
      this.pages = data || [];
    });
  }

  create(): void {
    this.router.navigate(["/pages/new"]);
  }

  edit(id: number): void {
    this.router.navigate(["/pages", id]);
  }
}
