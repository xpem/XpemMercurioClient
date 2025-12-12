export interface ProductBond {
    id: number;
    externalProductId: string;
    title: string;
    price: number;
    basePrice: number;
    originalPrice?: number;
    currencyId: string;
    quantity: number;
    availableQuantity: number;
    soldQuantity: number;
    marketplace: string;
    status: ProductStatusMercadoLivreBond;
    productId: number;
    statusText: string;
    statusClassColor?: string;
}

export enum ProductStatusMercadoLivreBond {
    Active, Paused, Closed, Undefined
}