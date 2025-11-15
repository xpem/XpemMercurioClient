export interface Order {
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