interface MovementHistoryItem {
  id: string;
  type: number;
  formattedType: 'entrada' | 'saida';
  quantity: number;
  reason: string;
  saleId?: string;
  date: string;
  balance: number;
  formattedDate?: string;
}
