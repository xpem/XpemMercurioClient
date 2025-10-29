import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-passwordsendemail',
  imports: [ReactiveFormsModule],
  templateUrl: './passwordsendemail.html',
  styleUrl: './passwordsendemail.css',
})
export class PasswordSendEmail implements OnInit {

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

    this.userService.postSendEmailUpdatePassword(email).subscribe({
      next: (response) => {
        this.toastService.showToast('Email enviado com sucesso!', 'success');
        this.router.navigate(['/user/signin']);
      },
      error: (error) => {
        console.error('Erro:', error);
      }
    });
  }
}
