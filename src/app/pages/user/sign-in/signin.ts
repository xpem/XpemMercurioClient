import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user-api';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.html',
  styleUrl: './signin.css',
  imports: [ReactiveFormsModule],
})
export class Signin implements OnInit {
  SignInForm!: FormGroup;
  submitted = false;
  isLoadingAccess: WritableSignal<boolean> = signal(false);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {

    //se usuario já estiver autenticado, redireciona para home
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }


    // Cria o FormGroup com os controles e validações
    this.SignInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Getter para facilitar o acesso aos controles do formulário no template
  get f() { return this.SignInForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.isLoadingAccess.set(true);

    // Para de processar se o formulário for inválido
    if (this.SignInForm.invalid) {
      this.isLoadingAccess.set(false);
      return;
    }

    const formData = this.SignInForm.value;

    this.userService.getUserToken(formData).subscribe({
      next: (response) => {

        const token = response.token;
        // Salva o token usando o AuthService
        // Supondo que você tenha um AuthService injetado para gerenciar o token
        this.authService.saveToken(token);
        // Redireciona para a página inicial após o login bem-sucedido
        this.router.navigate(['/home']);
        this.isLoadingAccess.set(false);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao obter token:', error?.error?.errorCode);

        if (error.error && error.error.errorCode === 5) {
          this.toastService.showError('Email ou senha inválidos!', 5000);
        } else {
          this.toastService.showError('Erro ao realizar login. Tente novamente.', 5000);
        }
        // Aqui você pode adicionar lógica para exibir uma mensagem de erro ao usuário
        this.isLoadingAccess.set(false);
      }
    });
  }
}
