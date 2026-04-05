export interface AppNotification {
    id: number;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
    readAt?: Date;
    type: NotificationType;
    objectType?: NotificationObjectType;
    // Propriedades adicionais para exibição
    icon?: string;
    borderStyle?: 'warning' | 'danger' | 'success' | 'default' | 'info' | string;
}

export enum NotificationType {
    Info = 0,
    Warning = 1,
    Error = 2,
    Success = 3
}

export enum NotificationObjectType {
    ImportOrder = 0,
    Product = 1,
    Shipment = 2,
    User = 3,
    MarketPlace = 4,
    System = 5,
    CreateOrder = 6,
    Invoice = 7,
}