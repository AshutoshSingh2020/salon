import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AdminService } from "../../services/admin.service";
import { getApiErrorMessage } from "../../utils/api-error";

@Component({
  selector: "app-about-admin",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="header">
      <h2>About Us Content</h2>
      <button type="button" (click)="save()">Save</button>
    </div>
    <form class="form">
      <label>
        Title
        <input type="text" [(ngModel)]="form.title" name="title" />
      </label>
      <label>
        Subtitle
        <input type="text" [(ngModel)]="form.subtitle" name="subtitle" />
      </label>
      <label>
        Main Content
        <textarea rows="6" [(ngModel)]="form.content" name="content"></textarea>
      </label>
      <label>
        Highlights (one per line)
        <textarea rows="5" [(ngModel)]="form.highlights" name="highlights"></textarea>
      </label>
      <label>
        Image URL (optional)
        <input type="text" [(ngModel)]="form.imageUrl" name="imageUrl" />
      </label>
      <p class="status">{{ status }}</p>
    </form>
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
      .form {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 16px;
        display: grid;
        gap: 10px;
        max-width: 720px;
      }
      label {
        display: grid;
        gap: 6px;
        font-size: 14px;
      }
      input, textarea {
        padding: 10px 12px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        font-family: inherit;
      }
      .status {
        color: var(--muted);
        margin: 0;
      }
    `
  ]
})
export class AboutAdminComponent implements OnInit {
  form: any = { title: "", subtitle: "", content: "", highlights: "", imageUrl: "" };
  status = "";

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getAbout().subscribe((data) => {
      this.form = {
        title: data?.title || "",
        subtitle: data?.subtitle || "",
        content: data?.content || "",
        highlights: data?.highlights || "",
        imageUrl: data?.image_url || ""
      };
    });
  }

  save(): void {
    this.status = "";
    this.adminService.updateAbout(this.form).subscribe({
      next: () => (this.status = "About content saved."),
      error: (err) => (this.status = getApiErrorMessage(err, "Save failed."))
    });
  }
}
