export interface Order {
    id: number;
    externalId: string;
    marketPlace: string;
    marketPlaceText: string;
    createdAt: string;
    externalDateCreated: string;
    externalLastUpdated: string;
    totalAmount: number;
    paidAmount: number;
    status: string;
    buyer?: OrderBuyer;
    products: OrderProduct[];
    printStatus: OrderShipmentLabelPrintStatus;
    printStatusText: string;
    shipmentExternalId?: string;
}

export interface OrderBuyer {
    externalId: string;
    marketPlace: string;
    createdAt: string;
    firstName?: string;
    lastName?: string;
}

export interface OrderProduct {
    externalId: string;
    marketPlace: string;
    createdAt: string;
    title: string;
    quantity: number;
    unitPrice: number;
    currencyId: string;
}

export enum OrderShipmentLabelPrintStatus {
    NotPrinted = 0,
    Printed = 1,
    Undefined = 2
}