import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./core/layout/header.component";
import { FooterComponent } from "./core/layout/footer.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <app-header></app-header>
    <main class="content">
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }
      .content {
        max-width: 1100px;
        margin: 0 auto;
        padding: 32px 24px 0;
        flex: 1;
      }
    `
  ]
})
export class AppComponent {}
