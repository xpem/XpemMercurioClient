import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../services/toast.service';
import { CompanyService } from '../../../services/company-api';

@Component({
  selector: 'app-company-invoice-sequence-edit',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './company-invoice-sequence-edit.html',
  styleUrl: './company-invoice-sequence-edit.css',
})
export class CompanyInvoiceSequenceEdit implements OnInit {
  taxInfoForm!: FormGroup;
  submitted = false;
  isLoading: WritableSignal<boolean> = signal(true);
  errorMessage: WritableSignal<string> = signal('');
  companyNotFound = signal(false);

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private toastService: ToastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.isLoading.set(true);

    this.taxInfoForm = this.fb.group({
      nFeNumber: ['', [Validators.required, Validators.min(1)]],
      batchNumber: ['', [Validators.required, Validators.min(1)]],
      nFeNumberHomol: ['', [Validators.min(1)]],
      batchNumberHomol: ['', [Validators.min(1)]]
    });
    this.loadTaxInfo();
  }

  get f() {
    return this.taxInfoForm.controls;
  }

  private loadTaxInfo(): void {
    this.companyService.getCompanyTaxInfo().subscribe({
      next: (taxInfo) => {

        this.companyNotFound.set(false);

        if (taxInfo) {
          this.taxInfoForm.patchValue({
            nFeNumber: taxInfo.nFeNumber || '',
            batchNumber: taxInfo.batchNumber || '',
            nFeNumberHomol: taxInfo.nFeNumberHomol || '',
            batchNumberHomol: taxInfo.batchNumberHomol || ''
          });
        }

        this.isLoading.set(false);
      },
      error: (err) => {
        //error code equals 2 indicates that company was not found, so we can assume that tax info is not set up yet
        if (err.error.errorCode === 2) {
          this.toastService.showInfo('Cadastre a empresa antes de configurar as informações fiscais');
          this.companyNotFound.set(true);
        } else {
          this.toastService.showError('Failed to load tax information');
        }
        this.isLoading.set(false);
      }
    });
  }

  // emitTestNFe(): void {
  // }

  public saveTaxInfo(): void {
    this.submitted = true;
    if (this.taxInfoForm.invalid) {
      return;
    }

    this.companyService.saveCompanyTaxInfo(this.taxInfoForm.value).subscribe({
      next: (taxInfo) => {
        this.toastService.showSuccess(taxInfo);
        this.router.navigate(['/company/invoice-sequence-edit']);
      },
      error: (err) => {
        this.toastService.showError('Failed to save tax information');
        this.submitted = false;
      }
    });
  }
}
