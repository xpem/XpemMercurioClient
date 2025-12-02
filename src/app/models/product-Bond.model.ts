export interface ProductBond {
    id: number;
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
}

export enum ProductStatusMercadoLivreBond {
    Active, Paused, Undefined
}