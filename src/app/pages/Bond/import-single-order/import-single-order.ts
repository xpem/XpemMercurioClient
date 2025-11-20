import { Component } from '@angular/core';

@Component({
  selector: 'app-import-single-order',
  imports: [],
  templateUrl: './import-single-order.html',
  styleUrl: './import-single-order.css',
})
export class ImportSingleOrder {

    goToOrderDetail(id: any) {
    //navegar para a pagina order passando o externalId como parametro
    window.location.href = `/order?id=${id}`;

  }
}
