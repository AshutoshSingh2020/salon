import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { CdkDragDrop, CdkDrag, CdkDropList } from "@angular/cdk/drag-drop";
import { AdminService } from "../../services/admin.service";
import { getApiErrorMessage } from "../../utils/api-error";

type MenuItemDraft = {
  id?: number;
  _key: string;
  location: "header" | "footer";
  label: string;
  url?: string;
  pageId?: number;
  parentId?: number | null;
  position?: number;
  isActive?: boolean;
  linkType: "page" | "custom";
};

@Component({
  selector: "app-menus",
  standalone: true,
  imports: [CommonModule, FormsModule, CdkDropList, CdkDrag],
  template: `
    <div class="header">
      <div>
        <h2>Menus</h2>
        <p class="hint">Build header and footer menus with submenus, linked to pages or custom URLs.</p>
      </div>
      <div class="controls">
        <select [(ngModel)]="location" name="location" (change)="load()">
          <option value="header">Header Menu</option>
          <option value="footer">Footer Menu</option>
        </select>
        <button type="button" (click)="addItem()">Add Menu Item</button>
        <button type="button" class="ghost" (click)="saveOrder()" [disabled]="!orderDirty">
          Save Order
        </button>
      </div>
    </div>

    <div class="items" *ngIf="items.length; else empty" cdkDropList (cdkDropListDropped)="drop($event)">
      <div class="card" *ngFor="let item of items" cdkDrag [class.child]="item.parentId">
        <div class="drag-row">
          <span class="drag-handle" cdkDragHandle>⋮⋮</span>
          <span class="chip" *ngIf="item.parentId">Submenu</span>
        </div>
        <div class="row">
          <label>
            Label
            <input type="text" [(ngModel)]="item.label" name="label-{{ item._key }}" />
          </label>
          <label>
            Link Type
            <select [(ngModel)]="item.linkType" name="linkType-{{ item._key }}" (change)="onLinkTypeChange(item)">
              <option value="page">Page</option>
              <option value="custom">Custom URL</option>
            </select>
          </label>
        </div>

        <div class="row" *ngIf="item.linkType === 'page'">
          <label>
            Page
            <select [(ngModel)]="item.pageId" name="page-{{ item._key }}" (change)="onPageSelect(item)">
              <option [ngValue]="undefined">Select page</option>
              <option *ngFor="let page of pages" [ngValue]="page.id">{{ page.title }} ({{ page.slug }})</option>
            </select>
          </label>
          <label>
            URL Preview
            <input type="text" [value]="getPageUrl(item)" disabled />
          </label>
        </div>

        <div class="row" *ngIf="item.linkType === 'custom'">
          <label>
            URL
            <input type="text" [(ngModel)]="item.url" name="url-{{ item._key }}" />
          </label>
        </div>

        <div class="row">
          <label>
            Parent Item
            <select [(ngModel)]="item.parentId" name="parent-{{ item._key }}">
              <option [ngValue]="null">None</option>
              <option *ngFor="let parent of parentOptions(item)" [ngValue]="parent.id">{{ parent.label }}</option>
            </select>
          </label>
          <label>
            Position
            <input type="number" [(ngModel)]="item.position" name="pos-{{ item._key }}" />
          </label>
          <label class="toggle">
            <input type="checkbox" [(ngModel)]="item.isActive" name="active-{{ item._key }}" />
            Active
          </label>
        </div>

        <div class="actions">
          <button type="button" (click)="saveItem(item)">{{ item.id ? "Update" : "Create" }}</button>
          <button type="button" class="danger" (click)="deleteItem(item)" [disabled]="!item.id">Delete</button>
        </div>
      </div>
    </div>

    <ng-template #empty>
      <div class="empty">
        <h3>No menu items yet</h3>
        <p>Create your first menu item to show pages on the site.</p>
      </div>
    </ng-template>
    <p class="status">{{ status }}</p>
  `,
  styles: [
    `
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }
      .controls {
        display: flex;
        gap: 8px;
        align-items: center;
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
      .ghost {
        background: transparent;
        border: 1px solid #e5e7eb;
        color: var(--brand);
      }
      select,
      input {
        padding: 8px 10px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        font-family: inherit;
      }
      .items {
        display: grid;
        gap: 12px;
        max-width: 900px;
      }
      .card {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 12px;
        display: grid;
        gap: 10px;
      }
      .card.child {
        margin-left: 18px;
        border-left: 3px solid #cbd5f5;
      }
      .drag-row {
        display: flex;
        gap: 8px;
        align-items: center;
        color: var(--muted);
        font-size: 12px;
      }
      .drag-handle {
        font-size: 18px;
        cursor: grab;
      }
      .chip {
        padding: 2px 8px;
        border-radius: 999px;
        background: #e2e8f0;
        color: #1f2937;
      }
      .row {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }
      .toggle {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 22px;
      }
      .actions {
        display: flex;
        gap: 8px;
      }
      .danger {
        background: #ef4444;
      }
      .empty {
        border: 1px dashed #d1d5db;
        border-radius: 12px;
        padding: 24px;
        text-align: center;
        background: #fafafa;
      }
      .status {
        color: var(--muted);
        margin-top: 12px;
      }
      @media (max-width: 900px) {
        .row {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class MenusComponent implements OnInit {
  location: "header" | "footer" = "header";
  items: MenuItemDraft[] = [];
  pages: any[] = [];
  status = "";
  orderDirty = false;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadPages();
    this.load();
  }

  loadPages(): void {
    this.adminService.listPages().subscribe((data) => {
      this.pages = data || [];
    });
  }

  load(): void {
    this.status = "";
    this.orderDirty = false;
    this.adminService.listMenuItems(this.location).subscribe((data) => {
      this.items = (data || []).map((item) => ({
        _key: String(item.id),
        id: item.id,
        location: this.location,
        label: item.label,
        url: item.url,
        pageId: item.pageId,
        parentId: item.parentId ?? null,
        position: item.position,
        isActive: item.isActive,
        linkType: item.pageId ? "page" : "custom"
      }));
    });
  }

  addItem(): void {
    const key = `new-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    this.items = [
      {
        _key: key,
        location: this.location,
        label: "",
        url: "",
        pageId: undefined,
        parentId: null,
        position: 0,
        isActive: true,
        linkType: "page"
      },
      ...this.items
    ];
  }

  drop(event: CdkDragDrop<MenuItemDraft[]>): void {
    if (event.previousIndex === event.currentIndex) return;
    const updated = [...this.items];
    const [item] = updated.splice(event.previousIndex, 1);
    updated.splice(event.currentIndex, 0, item);
    this.items = updated.map((entry, index) => ({
      ...entry,
      position: (index + 1) * 10
    }));
    this.orderDirty = true;
  }

  parentOptions(item: MenuItemDraft) {
    return this.items.filter((option) => option.id && option.id !== item.id);
  }

  onLinkTypeChange(item: MenuItemDraft): void {
    if (item.linkType === "page") {
      item.url = "";
    } else {
      item.pageId = undefined;
    }
  }

  onPageSelect(item: MenuItemDraft): void {
    if (!item.pageId) return;
    const page = this.pages.find((p) => p.id === item.pageId);
    if (page && !item.label) {
      item.label = page.title;
    }
  }

  getPageUrl(item: MenuItemDraft): string {
    if (!item.pageId) return "";
    const page = this.pages.find((p) => p.id === item.pageId);
    return page ? `/${page.slug}` : "";
  }

  saveItem(item: MenuItemDraft): void {
    const payload = {
      location: item.location,
      label: item.label,
      url: item.linkType === "custom" ? item.url : undefined,
      pageId: item.linkType === "page" ? item.pageId : undefined,
      parentId: item.parentId ?? undefined,
      position: item.position ?? 0,
      isActive: item.isActive ?? true
    };
    if (item.id) {
      this.adminService.updateMenuItem(item.id, payload).subscribe({
        next: () => (this.status = "Menu item updated."),
        error: (err) => (this.status = getApiErrorMessage(err, "Update failed."))
      });
      return;
    }
    this.adminService.createMenuItem(payload).subscribe({
      next: (res) => {
        item.id = res?.id;
        item._key = String(res?.id || item._key);
        this.status = "Menu item created.";
      },
      error: (err) => (this.status = getApiErrorMessage(err, "Create failed."))
    });
  }

  saveOrder(): void {
    const updates = this.items.filter((item) => item.id);
    if (!updates.length) return;
    let completed = 0;
    for (const item of updates) {
      this.adminService
        .updateMenuItem(item.id as number, { position: item.position, parentId: item.parentId })
        .subscribe({
          next: () => {
            completed += 1;
            if (completed === updates.length) {
              this.status = "Menu order saved.";
              this.orderDirty = false;
            }
          },
          error: (err) => {
            this.status = getApiErrorMessage(err, "Failed to save menu order.");
          }
        });
    }
  }

  deleteItem(item: MenuItemDraft): void {
    if (!item.id) {
      this.items = this.items.filter((entry) => entry._key !== item._key);
      return;
    }
    this.adminService.deleteMenuItem(item.id).subscribe({
      next: () => {
        this.items = this.items.filter((entry) => entry.id !== item.id);
        this.status = "Menu item deleted.";
      },
      error: (err) => (this.status = getApiErrorMessage(err, "Delete failed."))
    });
  }
}
