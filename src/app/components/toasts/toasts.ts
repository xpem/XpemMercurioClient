import { Component, HostBinding, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toasts',
  imports: [],
  templateUrl: './toasts.html',
  styleUrl: './toasts.css',
  standalone: true,
})
export class Toasts {
  public toastService = inject(ToastService);

  // @HostBinding('class') get hostClass() {
  //   return 'toasts-container top-0 end-0 p-3';
  // }

}
