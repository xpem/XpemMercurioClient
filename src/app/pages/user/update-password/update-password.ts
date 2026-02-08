import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { UserService } from '../../../services/user-api';
import { Router } from '@angular/router';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-update-password',
  imports: [ReactiveFormsModule],
  templateUrl: './update-password.html',
  styleUrl: './update-password.css',
})
export class UpdatePassword implements OnInit {

  UpdatePasswordForm!: FormGroup;
  submitted = false;
  errorMessage: WritableSignal<string> = signal('');

  constructor(private fb: FormBuilder,
    private userService: UserService,
    private toastService: ToastService,
    private router: Router) { }

  ngOnInit(): void {
    this.UpdatePasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(4)]],
    }, { validators: this.passwordsMatchValidator('password', 'confirmPassword') });
  }

  passwordsMatchValidator(controlName: string, checkControlName: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const control = formGroup.get(controlName);
      const checkControl = formGroup.get(checkControlName);

      if (checkControl?.errors && !checkControl.errors['mustMatch']) {
        // Retorna se outro validador já encontrou um erro no campo de confirmação
        return null;
      }

      // Define o erro no campo de confirmação se as senhas não coincidirem
      if (control?.value !== checkControl?.value) {
        checkControl?.setErrors({ mustMatch: true });
        return { mustMatch: true };
      } else {
        checkControl?.setErrors(null);
        return null;
      }
    };
  }


  // Getter para facilitar o acesso aos controles do formulário no template
  get f() { return this.UpdatePasswordForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.UpdatePasswordForm.invalid) {
      return;
    }

    this.errorMessage.set('');

    //recuperar o token da query string
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      console.log('Token encontrado:', token);

      this.userService.putUpdatePassword(token, this.UpdatePasswordForm.value.password).subscribe({
        next: (response) => {
          this.toastService.showSuccess('Senha atualizada com sucesso!', 5000);
          this.router.navigate(['/user/signin']);
        },
        error: (error) => {
          console.error('Erro:', error);
          console.error('mensagem do erro:', error.error.message);

          this.errorMessage.set(error.error.message || 'Erro ao tentar atualizar a senha.');
        }
      });
    }
  }
}
