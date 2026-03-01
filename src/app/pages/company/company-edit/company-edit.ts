import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { Company } from '../../../models/company/company.model';
import { FormControl, FormGroup, ReactiveFormsModule, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-company-edit',
  imports: [ReactiveFormsModule],
  templateUrl: './company-edit.html',
  styleUrl: './company-edit.css',
})
export class CompanyEdit implements OnInit {
  company: WritableSignal<Company> = signal({} as Company);
  isLoading: WritableSignal<boolean> = signal(true);
  companyForm!: FormGroup;
  submitted = false;
  // errorMessage: string = '';
  errorMessage: WritableSignal<string> = signal('');

  constructor(private fb: FormBuilder, private router: Router, private toastService: ToastService) { }

  ngOnInit(): void {
    this.isLoading.set(true);

    this.companyForm = this.fb.group({
      //deixar o cnpj aberto por conta do cnpj alfanumérico
      cnpj: ['', [Validators.required]],
      name: ['', [Validators.required]],
      tradeName: [''],
      address: this.fb.group({
        street: ['', [Validators.required]],
        number: ['', [Validators.required, Validators.pattern(/^\d+$/), Validators.maxLength(10)]],
        complement: [''],
        neighborhood: [''],
        city: ['', [Validators.required]],
        cityCode: ['', [Validators.required]],
        state: ['', [Validators.required]],
        postalCode: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
        phone: ['', [Validators.required, Validators.pattern(/^\d{10,11}$/)]],
      }),
      stateRegistration: [''],
    });

    //mock company data

    this.company.set({
      cnpj: '12345678000100',
      name: 'Empresa de Teste LTDA',
      tradeName: 'Empresa de Teste',
      address: {
        street: 'Rua de Teste',
        number: '123',
        neighborhood: 'Bairro de Teste',
        city: 'Cidade de Teste',
        cityCode: 12345,
        state: 1,
        postalCode: '12345678',
        phone: '11999999999'
      },
      stateRegistration: '123456789',
      publicId: '12345678-1234-1234-1234-123456789012'
    });

    this.isLoading.set(false);
  }

    // Getter para facilitar o acesso aos controles do formulário no template
  get f() { return this.companyForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.errorMessage.set('');
    if (this.companyForm.invalid) {
      return;
    }
    const formData = this.companyForm.value;

    this.toastService.showSuccess('Empresa criada com sucesso!', 5000);

    this.router.navigate(['/company']);
  }
}
