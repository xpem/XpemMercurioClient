import { OrderStatus } from "./order.model";

export interface OrderFilter {
    orderExternalId?: string;
    buyerName?: string;
    createdAfter?: Date;
    createdBefore?: Date;
    productExternalId?: string;
    productName?: string;
    orderStatus?: OrderStatus[];
}