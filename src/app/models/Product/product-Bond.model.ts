export interface ProductBond {
    id: number;
    externalProductId: string;
    title: string;
    price: number;
    basePrice: number;
    originalPrice?: number;
    currencyId: string;
    quantity: number;
    // availableQuantity: number;
    soldQuantity: number;
    marketplace: number; // 1 para Mercado Livre, 2 para Shopee
    status: ProductStatusMercadoLivreBond;
    productId: number;
    statusText: string;
    statusClassColor?: string;
    visits: number;
}

export enum ProductStatusMercadoLivreBond {
    Active, Paused, Closed, Undefined
}