import { EventEmitter, Events } from "../event-emitter";
import { INotification } from "./notifications.model";

export class NotificationsService {
    constructor(private eventEmitter: EventEmitter) { }

    private notifications: INotification[] = [];

    addNotification(notification: INotification): number {
        const newId = Math.max(...this.notifications.map(o => o.id), 0) + 1;
        notification.id = newId;
        this.notifications = [
            ...this.notifications,
            notification
        ]
        this.eventEmitter.emit(Events.NotificationsUpdated, [...this.notifications]);
        return newId;
    };

    clearMessages() {
        this.notifications = [];
        this.eventEmitter.emit(Events.NotificationsUpdated, [...this.notifications]);
    };

    deleteMessage(id: number): void {
        this.notifications = this.notifications.filter(n => id !== n.id);
        this.eventEmitter.emit(Events.NotificationsUpdated, [...this.notifications]);
    };

    getMessages(): INotification[] {
        return this.notifications;
    };
};