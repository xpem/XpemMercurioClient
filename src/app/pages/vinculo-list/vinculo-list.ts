import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { Sidebar } from "../../components/sidebar/sidebar";
import { UserService } from '../../services/user-api';
import { UserProfile } from '../../models/user-profile.model';

 declare const bootstrap: any;

@Component({
  selector: 'app-vinculo-list',
  imports: [Sidebar],
  templateUrl: './vinculo-list.html',
  styleUrl: './vinculo-list.css',
})
export class VinculoList implements OnInit {

  userProfile: WritableSignal<UserProfile | null> = signal(null);

  constructor(private userService: UserService) { }


  ngOnInit(): void {
    console.log('VinculoList component initialized');

    this.userService.getUserProfile().subscribe({
      next: (response) => {
        console.log('User profile:', response);

        var _userProfile = {} as UserProfile;

        if (response.mercadoLivreCredentialid) {
          _userProfile.mercadoLivreCredentialid = response.mercadoLivreCredentialid;
        }

        this.userProfile.set(_userProfile);
      },
      error: (error) => {
        console.error('Error fetching user profile:', error);
      }
    });
  }

  showErrorModal(): void {
    const modalElement = document.getElementById('ErrorImportSingleOrderModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
}
