import { EventEmitter } from "../event-emitter";
import { INotification } from "./notifications.model";

type NotificationsEvents = {
    NotificationsUpdated: INotification[];
};

export class NotificationsService {
    constructor(private eventEmitter: EventEmitter<NotificationsEvents>) { }

    private notifications: INotification[] = [];

    addNotification(notification: INotification): number {
        const newId = Math.max(...this.notifications.map(o => o.id), 0) + 1;
        notification.id = newId;
        this.notifications = [...this.notifications, notification];
        this.eventEmitter.emit("NotificationsUpdated", [...this.notifications]);
        return newId;
    }

    clearNotifications() {
        this.notifications = [];
        this.eventEmitter.emit("NotificationsUpdated", [...this.notifications]);
    }

    deleteNotification(id: number): void {
        this.notifications = this.notifications.filter(n => id !== n.id);
        this.eventEmitter.emit("NotificationsUpdated", [...this.notifications]);
    }

    getNotifications(): INotification[] {
        return this.notifications;
    }
}