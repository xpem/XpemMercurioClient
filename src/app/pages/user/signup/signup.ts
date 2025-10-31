import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { UserService } from '../../../services/user-api';
import { Router } from '@angular/router';
import { CreateUserPayload } from '../../../models/user.model';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
  standalone: true
})
export class Signup implements OnInit {
  SignUpForm!: FormGroup;
  submitted = false;
  // errorMessage: string = '';
  errorMessage: WritableSignal<string> = signal('');

  constructor(private fb: FormBuilder, private userService: UserService, private toastService: ToastService,
    private router: Router) { }

  ngOnInit(): void {
    // Cria o FormGroup com os controles e validações
    this.SignUpForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(4)]],
    }, { validators: this.passwordsMatchValidator('password', 'confirmPassword') }); // <-- validador aplicado aqui
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
  get f() { return this.SignUpForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.errorMessage.set('');

    if (this.SignUpForm.invalid) {
      return;
    }

    const formData = this.SignUpForm.value;

    // Aqui você pode enviar os dados do formulário para o servidor
    console.log('Formulário válido enviado:', formData);

    const createUserPayload: CreateUserPayload = {
      name: formData.name,
      email: formData.email,
      password: formData.password
    };

    this.userService.postCreateUser(createUserPayload).subscribe({
      next: (response) => {
        console.log('Usuário criado com sucesso:', response);

        this.toastService.showToast('Usuário criado com sucesso!', 'success');
        // Redireciona para a página inicial após o login bem-sucedido
        this.router.navigate(['/user/signin']);
      },
      error: (error) => {
        console.error('Erro ao tentar criar usuário:', error);

        this.errorMessage.set(error.error || 'Erro ao criar usuário.');
      }
    });
  }
}
