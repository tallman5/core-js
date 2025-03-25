import { describe, it, expect, vi } from 'vitest';
import { NotificationsService } from './notifications.service';
import { EventEmitter } from '../event-emitter';
import { INotification, UiFunction } from './notifications.model';

type NotificationsEvents = {
    NotificationsUpdated: INotification[];
};

describe('NotificationsService', () => {
    it('should add a notification and emit an event', () => {
        const eventEmitter = new EventEmitter<NotificationsEvents>();
        const service = new NotificationsService(eventEmitter);
        const mockListener = vi.fn();

        eventEmitter.on("NotificationsUpdated", mockListener);
        const notification: INotification = {
            id: 0,
            uiFunction: UiFunction.Primary,
            displayTimeout: 5000,
            title: 'New Notification',
            details: 'This is a test notification.'
        };
        const newId = service.addNotification(notification);

        expect(newId).toBe(1);
        expect(service.getNotifications()).toHaveLength(1);
        expect(mockListener).toHaveBeenCalledWith(service.getNotifications());
    });

    it('should clear all notifications and emit an event', () => {
        const eventEmitter = new EventEmitter<NotificationsEvents>();
        const service = new NotificationsService(eventEmitter);
        const mockListener = vi.fn();

        service.addNotification({
            id: 0,
            uiFunction: UiFunction.Secondary,
            displayTimeout: 3000
        });
        eventEmitter.on("NotificationsUpdated", mockListener);
        service.clearNotifications();

        expect(service.getNotifications()).toHaveLength(0);
        expect(mockListener).toHaveBeenCalledWith([]);
    });

    it('should delete a specific notification and emit an event', () => {
        const eventEmitter = new EventEmitter<NotificationsEvents>();
        const service = new NotificationsService(eventEmitter);
        const mockListener = vi.fn();

        eventEmitter.on("NotificationsUpdated", mockListener);
        service.addNotification({
            id: 0,
            uiFunction: UiFunction.Success,
            displayTimeout: 4000,
            title: 'Keep'
        });
        const idToDelete = service.addNotification({
            id: 0,
            uiFunction: UiFunction.Danger,
            displayTimeout: 2000,
            title: 'Delete Me'
        });
        service.deleteNotification(idToDelete);

        expect(service.getNotifications()).toHaveLength(1);
        expect(service.getNotifications()[0].title).toBe('Keep');
        expect(mockListener).toHaveBeenCalledWith(service.getNotifications());
    });
});
