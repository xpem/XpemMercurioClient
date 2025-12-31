export interface AppNotification {
    id: number;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
    readAt?: Date;
    type: NotificationType;
    objectType?: NotificationObjectType;
}

export enum NotificationType {
    Info = 'Info',
    Warning = 'Warning',
    Error = 'Error',
    Success = 'Success'
}

export enum NotificationObjectType {
    Order = 'Order',
    Product = 'Product',
    Shipment = 'Shipment',
    User = 'User',
    MarketPlace = 'MarketPlace',
    System = 'System'
}