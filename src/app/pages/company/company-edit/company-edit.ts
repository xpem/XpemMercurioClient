import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { Company } from '../../../models/company/company.model';
import { FormControl, FormGroup, ReactiveFormsModule, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-company-edit',
  imports: [ReactiveFormsModule, RouterLink],
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
        phone: [
          '',
          [Validators.required, Validators.pattern(/^(\d{10,11}|\(\d{2}\)\s\d{4,5}-\d{4})$/)],
        ],
        email: ['', [Validators.required, Validators.email]],
      }),
      stateRegistration: [''],
      crt: ['', [Validators.required]],
    });

    //mock company data

    this.company.set({} as Company
    //   {
    //   cnpj: '12345678000100',
    //   name: 'Empresa de Teste LTDA',
    //   tradeName: 'Empresa de Teste',
    //   crt: 1,
    //   address: {
    //     street: 'Rua de Teste',
    //     number: '123',
    //     neighborhood: 'Bairro de Teste',
    //     city: 'Cidade de Teste',
    //     cityCode: 12345,
    //     stateCode: 31,
    //     postalCode: '12345678',
    //     phone: '11999999999',
    //     email: 'teste@teste.com',
    //   },
    //   stateRegistration: '123456789',
    //   publicId: '12345678-1234-1234-1234-123456789012'
    // }
  );

    this.companyForm.patchValue({
      cnpj: this.company().cnpj,
      name: this.company().name,
      tradeName: this.company().tradeName,
      stateRegistration: this.company().stateRegistration,
      address: {
        street: this.company().address?.street,
        number: this.company().address?.number,
        complement: this.company().address?.complement,
        neighborhood: this.company().address?.neighborhood,
        city: this.company().address?.city,
        cityCode: this.company().address?.cityCode,
        state: this.company().address?.stateCode,
        postalCode: this.company().address?.postalCode,
        phone: this.company().address?.phone,
        email: this.company().address?.email,
      },
      crt: this.company().crt,
    });

    this.isLoading.set(false);
  }

  // Getter para facilitar o acesso aos controles do formulário no template
  get f() { return this.companyForm.controls; }

  get af() {
    return (this.companyForm.get('address') as FormGroup).controls;
  }

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

  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 11);

    if (!digits) {
      input.value = '';
      return;
    }

    const ddd = digits.slice(0, 2);
    const isCellphone = digits.length > 10;
    const prefixEnd = isCellphone ? 7 : 6;
    const prefix = digits.slice(2, prefixEnd);
    const suffix = digits.slice(prefixEnd, 11);

    let masked = `(${ddd}`;

    if (digits.length >= 3) {
      masked += `) ${prefix}`;
    }

    if (suffix) {
      masked += `-${suffix}`;
    }

    input.value = masked;
  }
}
