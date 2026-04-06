export interface ProductQuantityHistory {
  id: string;
  type: number;
  formattedType: 'entrada' | 'saida';
  previousQuantity: number;
  movedQuantity: number;
  reason: string;
  // saleId?: string;
  date: string;
  newQuantity: number;
  // formattedDate?: string;
}
