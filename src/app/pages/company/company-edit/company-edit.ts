import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../services/toast.service';
import { CompanyService } from '../../../services/company-api';
import { Company } from '../../../models/company/company.model';

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
  certificateForm!: FormGroup;
  submitted = false;
  certificateSubmitted = false;
  // errorMessage: string = '';
  errorMessage: WritableSignal<string> = signal('');
  // Determina se estamos criando ou editando uma empresa
  isCreateMode: WritableSignal<boolean> = signal(true);
  uploadCertificatePanelIsVisible: WritableSignal<boolean> = signal(false);
  constructor(private fb: FormBuilder, private router: Router, private toastService: ToastService, private companyService: CompanyService) { }

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
        cityName: ['', [Validators.required]],
        cityCode: ['', [Validators.required]],
        state: ['', [Validators.required]],
        postalCode: ['', [Validators.required, this.postalCodeValidator()]],
        phone: [
          '',
          [Validators.required, this.phoneValidator()],
        ],
        email: ['', [Validators.required, Validators.email]],
      }),
      stateRegistration: [''],
      crt: ['', [Validators.required]],
      ibpt: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
    });

    this.certificateForm = this.fb.group({
      certificateFile: [null, [Validators.required]],
      certificatePassword: ['', [Validators.required]],
    });

    this.companyService.getCompany().subscribe({
      next: (response) => {
        if (response) {

          this.company.set(response);
          this.isCreateMode.set(false); // Se a empresa existe, estamos em modo de edição

          if (response.hasCertificate) {
            this.uploadCertificatePanelIsVisible.set(false);
          }

          this.populateForm(response);
        }
        else {
          this.isCreateMode.set(true);
          this.uploadCertificatePanelIsVisible.set(true);

          this.populateForm({} as Company); // Preencher o formulário com valores vazios
        }

        this.isLoading.set(false);
      },
      error: (error) => {
        this.toastService.showError('Erro ao carregar empresa.', 5000);
        console.error('Erro ao carregar empresa:', error);
        this.isLoading.set(false);
      },
    });
  }

  ShowUploadCertificatePanel(): void {
    this.uploadCertificatePanelIsVisible.set(true);
  }

  private populateForm(company: Company): void {
    if (company) {
      this.companyForm.patchValue({
        cnpj: company.cnpj,
        name: company.name,
        tradeName: company.tradeName,
        stateRegistration: company.stateRegistration,
        address: {
          street: company.address?.street,
          number: company.address?.number,
          complement: company.address?.complement,
          neighborhood: company.address?.neighborhood,
          cityName: company.address?.cityName,
          cityCode: company.address?.cityCode,
          state: company.address?.state,
          postalCode: company.address?.postalCode,
          phone: company.address?.phone,
          email: company.address?.email,
        },
        crt: company.crt,
        ibpt: company.ibpt,
      });
    }
  }

  onIBPTInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^0-9.,]/g, '').replace(',', '.');
    const parts = value.split('.');

    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }
    if (parts[1]?.length > 2) {
      value = parts[0] + '.' + parts[1].slice(0, 2);
    }
    input.value = value;
    this.companyForm.get('ibpt')?.setValue(value, { emitEvent: false });
  }

  // Getter para facilitar o acesso aos controles do formulário no template
  get f() { return this.companyForm.controls; }

  get af() {
    return (this.companyForm.get('address') as FormGroup).controls;
  }

  get cf() {
    return this.certificateForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage.set('');

    if (this.companyForm.invalid) {
      return;
    }

    const formData = this.companyForm.value;

    console.log('Formulário válido enviado:', formData);

    const companyPayload: Company = {
      cnpj: formData.cnpj,
      name: formData.name,
      tradeName: formData.tradeName,
      stateRegistration: formData.stateRegistration,
      crt: formData.crt,
      address: {
        street: formData.address.street,
        number: formData.address.number,
        complement: formData.address.complement,
        neighborhood: formData.address.neighborhood,
        cityName: formData.address.cityName,
        cityCode: formData.address.cityCode,
        state: formData.address.state,
        postalCode: formData.address.postalCode,
        phone: formData.address.phone,
        email: formData.address.email,
      },
      ibpt: formData.ibpt,
    };

    //retirar pontos, traços e barras do cnpj
    companyPayload.cnpj = companyPayload.cnpj.replace(/[.\-\/]/g, '');

    if (companyPayload.address) {
      companyPayload.address.postalCode = companyPayload.address?.postalCode.replace(/[-]/g, '');
      companyPayload.address.phone = companyPayload.address?.phone.replace(/[\(\)\-\s]/g, '');
    }
    //console log em formato de json
    console.log('Payload a ser enviado para a API:', JSON.stringify(companyPayload, null, 2));

    this.companyService.saveCompany(companyPayload, this.isCreateMode()).subscribe({
      next: (response) => {
        if (this.isCreateMode()) {
          this.toastService.showSuccess('Empresa criada com sucesso!', 5000);
        } else {
          this.toastService.showSuccess('Empresa atualizada com sucesso!', 5000);
        }
        this.router.navigate(['/company']);
      },
      error: (error) => {
        if (error.status === 400 && error.error && error.error.message) {
          this.errorMessage.set(error.error.message);
          this.toastService.showError(error.error.message, 5000);
        } else {
          if (this.isCreateMode()) {
            this.errorMessage.set('Erro ao criar empresa.');
            this.toastService.showError('Erro ao criar empresa.', 5000);
            console.error('Erro ao criar empresa:', error);
          } else {
            this.errorMessage.set('Erro ao atualizar empresa.');
            this.toastService.showError('Erro ao atualizar empresa.', 5000);
            console.error('Erro ao atualizar empresa:', error);
          }
        }
      },
    });
  }

  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 11);

    if (!digits) {
      input.value = '';
      this.companyForm.get('address.phone')?.setValue('', { emitEvent: false });
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
    this.companyForm.get('address.phone')?.setValue(masked, { emitEvent: false });
  }

  onInputPostalCode(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 8);
    if (!digits) {
      input.value = '';
      this.companyForm.get('address.postalCode')?.setValue('', { emitEvent: false });
      return;
    }
    let masked = digits;
    if (digits.length > 5) {
      masked = `${digits.slice(0, 5)}-${digits.slice(5)}`;
    }
    input.value = masked;
    this.companyForm.get('address.postalCode')?.setValue(masked, { emitEvent: false });
  }

  private phoneValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = (control.value ?? '').toString();

      if (!value) {
        return null;
      }

      const digits = value.replace(/\D/g, '');
      const isValid = digits.length === 10 || digits.length === 11;

      return isValid ? null : { phoneInvalid: true };
    };
  }

  private postalCodeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = (control.value ?? '').toString();

      if (!value) {
        return null;
      }

      const digits = value.replace(/\D/g, '');
      const isValid = digits.length === 8;
      return isValid ? null : { postalCodeInvalid: true };
    };
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files.length > 0 ? input.files[0] : null;
    this.certificateForm.patchValue({ certificateFile: file });
    this.certificateForm.get('certificateFile')?.markAsTouched();
    this.certificateForm.get('certificateFile')?.updateValueAndValidity();
  }

  uploadCertificate(): void {
    this.certificateSubmitted = true;

    if (this.certificateForm.invalid) {
      return;
    }

    const certificateFile = this.certificateForm.get('certificateFile')?.value as File | null;
    const certificatePassword = this.certificateForm.get('certificatePassword')?.value as string;

    if (!certificateFile) {
      return;
    }

    this.companyService.uploadCertificate(certificateFile, certificatePassword).subscribe({
      next: () => {
        this.toastService.showSuccess('Certificado enviado com sucesso!', 5000);
        this.certificateForm.reset();
        this.certificateSubmitted = false;
        this.uploadCertificatePanelIsVisible.set(true);
      },
      error: (error) => {
        this.toastService.showError('Erro ao enviar certificado.', 5000);
        console.error('Erro ao enviar certificado:', error);
      },
    });
  }

}
