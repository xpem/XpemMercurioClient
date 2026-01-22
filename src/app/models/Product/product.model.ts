export interface Product {
    id: number;
    title: string;
    price: number;
    basePrice: number;
    // originalPrice?: number;
    currencyId: string;
    quantity: number;
    availableQuantity: number;
    soldQuantity: number;
    publicId: string;
    sku: string;
}
