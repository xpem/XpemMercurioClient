import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { CreateUserPayload } from '../../../models/user.model';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup implements OnInit {
  SignUpForm!: FormGroup;
  submitted = false;
  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) { }


  ngOnInit(): void {
    // Cria o FormGroup com os controles e validações
    this.SignUpForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(4)]],
    }, { validators: this.passwordsMatchValidator('password', 'confirmPassword') }); // <-- validador aplicado aqui
  }

  // passwordMatchValidator(form: FormGroup) {
  //   return form.get('password')?.value === form.get('confirmPassword')?.value
  //     ? null : { 'mismatch': true };
  // }

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
        // Redireciona para a página inicial após o login bem-sucedido
        this.router.navigate(['/user/signin']);
      },
      error: (error) => {
        console.error('Erro ao tentar criar usuário:', error);

         console.error('Erro ao obter token:', error.error);
        // Aqui você pode adicionar lógica para exibir uma mensagem de erro ao usuário
      }
    });
  }
}
