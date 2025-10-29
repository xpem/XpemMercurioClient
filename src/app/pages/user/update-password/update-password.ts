import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-update-password',
  imports: [ReactiveFormsModule],
  templateUrl: './update-password.html',
  styleUrl: './update-password.css',
  standalone: true
})
export class UpdatePassword implements OnInit {

  sendEmailUpdatePasswordForm!: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, private userService: UserService,
    private toastService: ToastService,
    private router: Router) { }

  ngOnInit(): void {
    this.sendEmailUpdatePasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // Getter para facilitar o acesso aos controles do formulário no template
  get f() { return this.sendEmailUpdatePasswordForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.sendEmailUpdatePasswordForm.invalid) {
      return;
    }

    const email = this.sendEmailUpdatePasswordForm.value.email;

    //recuperar o token da query string
    // const urlParams = new URLSearchParams(window.location.search);
    // const token = urlParams.get('token');

    // if (token) {
      this.userService.postSendEmailUpdatePassword(email).subscribe({
        next: (response) => {
          // console.log('Email enviado!', response);
          this.toastService.showToast('Email enviado com sucesso!', 'success');
          this.router.navigate(['/user/signin']);
        },
        error: (error) => {
          console.error('Erro:', error);
        }
      });
    // }
  }
}
