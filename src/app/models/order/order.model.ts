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
    status: OrderStatus;
    buyer?: OrderBuyer;
    products: OrderProduct[];
    printStatus: OrderShipmentLabelPrintStatus;
    printStatusText: string;
    shipmentExternalId?: string;
    shippingSellerCost: number;
    shippingBuyerCost: number;
    liquidAmount: number;
    liquidProductsAmount: number;
    externalPackId?: string;
    invoiceStatus: OrderNFeStatus;
    invoiceStatusText: string;
    invoiceCreated: boolean;
    invoiceErrorMessage?: string | null;
    invoiceNumber?: string | null;
    invoiceKey?: string | null;
    invoiceProtocolNumber?: string | null;
    invoiceAuthorizedDate?: string | null;
}

export enum OrderStatus {
    Confirmada = 1,
    Paga = 2,
    Cancelada = 5
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
    saleFee: number;
}

export enum OrderShipmentLabelPrintStatus {
    NotPrinted = 0,
    Printed = 1,
    Undefined = 2,
    Stale = 3,
    InvoicePending = 4,
    LogisticsInProcess = 5,
    AwaitingCarrierConfirmation = 6
}

export enum OrderNFeStatus {
    Pending = 0,
    IssuanceInProgress = 1,
    Issued = 2,
    IssuanceFailed = 3,
    CancellationInProgress = 4,
    Cancelled = 5,
    CancellationFailed = 6,
    Error = 7,
    BatchProcessing = 8    
}