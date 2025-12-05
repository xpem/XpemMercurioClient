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
    status: string;
    productId: number;
    statusText: string;
    statusClassColor?: string;
}