import { OrderStatus } from "./order.model";

export interface OrderFilter {
    orderExternalId?: string;
    buyerName?: string;
    createdAfter?: Date;
    createdBefore?: Date;
    productExternalId?: string;
    productName?: string;
    orderStatus?: OrderStatus[];
    productSKU?: string;
}

export interface OrderFilterDisplay {
  externalId: string;
  createdAfter: string;
  createdBefore: string;
  productId: string;
  productSKU: string;
  productName: string;
  status: string;
}