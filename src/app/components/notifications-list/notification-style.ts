import { AppNotification, NotificationObjectType, NotificationType } from '../../models/appNotification.model';

export function notificationStyle(n: AppNotification): AppNotification {
  return {
    ...n,
    borderStyle: getBorderStyle(n.type),
    icon: getIcon(n.objectType ?? NotificationObjectType.System),
  };
}

function getBorderStyle(type: NotificationType): string {
  const map: Record<NotificationType, string> = {
    [NotificationType.Info]: 'info',
    [NotificationType.Warning]: 'warning',
    [NotificationType.Error]: 'danger',
    [NotificationType.Success]: 'success',
  };
  return map[type] ?? 'secondary';
}

function getIcon(objectType: NotificationObjectType): string {
  const map: Record<NotificationObjectType, string> = {
    [NotificationObjectType.ImportOrder]: 'cart-check',
    [NotificationObjectType.Product]: 'box-seam',
    [NotificationObjectType.Shipment]: 'truck',
    [NotificationObjectType.User]: 'person-circle',
    [NotificationObjectType.MarketPlace]: 'shop',
    [NotificationObjectType.System]: 'cpu',
    [NotificationObjectType.CreateOrder]: 'cart-plus',
    [NotificationObjectType.Invoice]: 'file-earmark-ruled',
  };
  return map[objectType] ?? 'bell';
}
