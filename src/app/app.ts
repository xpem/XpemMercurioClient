import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toasts } from "./components/toasts/toasts";
import { Sidebar } from "./components/sidebar/sidebar";
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toasts, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('XpemMercurioClient');

    constructor(public authService: AuthService) {}
  
}


// ng g c home --skip-tests