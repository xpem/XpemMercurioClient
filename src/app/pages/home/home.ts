import { Component } from '@angular/core';
import { Sidebar } from '../../components/sidebar/sidebar';
import { ToastService } from '../../services/toast.service';
  
@Component({
  selector: 'app-home',
  imports: [Sidebar],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor(private toastService: ToastService) {}

salvarDados() {
    // Lógica para salvar os dados...

    // Exibe o toast
    this.toastService.showToast('Dados salvos com sucesso!', 'success');
  }
}
