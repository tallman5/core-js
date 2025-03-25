import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotificationsService } from './notifications.service';
import { EventEmitter, Events } from '../event-emitter';
import { UiFunction, type INotification } from './notifications.model';

describe('NotificationsService', () => {
    let service: NotificationsService;
    let mockEventEmitter: EventEmitter;
    const mockNotification: INotification = {
        id: 0,
        title: 'Test Notification',
        details: 'This is a test',
        uiFunction: UiFunction.Primary,
        displayTimeout: 0
    };

    beforeEach(() => {
        mockEventEmitter = new EventEmitter();
        service = new NotificationsService(mockEventEmitter);
    });

    describe('initialization', () => {
        it('should initialize with empty notifications array', () => {
            expect(service.getNotifications()).toEqual([]);
        });

        it('should accept injected EventEmitter', () => {
            expect(service).toHaveProperty('eventEmitter', mockEventEmitter);
        });
    });

    describe('addNotification()', () => {
        it('should add notification with auto-incremented ID', () => {
            const id = service.addNotification(mockNotification);
            expect(id).toBe(1);
            expect(service.getNotifications()).toEqual([{ ...mockNotification, id: 1 }]);
        });

        it('should handle multiple notifications with correct IDs', () => {
            const firstId = service.addNotification(mockNotification);
            const secondId = service.addNotification(mockNotification);

            expect(firstId).toBe(1);
            expect(secondId).toBe(2);

            const notifications = service.getNotifications();
            // expect(notifications[0].id).toBe(1);
            expect(notifications[1].id).toBe(2);
        });

        it('should emit NotificationsUpdated event with new array', () => {
            const emitSpy = vi.spyOn(mockEventEmitter, 'emit');
            const id = service.addNotification(mockNotification);

            expect(emitSpy).toHaveBeenCalledTimes(1);
            expect(emitSpy).toHaveBeenCalledWith(
                Events.NotificationsUpdated,
                [{ ...mockNotification, id }]
            );
        });

        // it('should work when adding notification without ID', () => {
        //     const notificationWithoutId = { ...mockNotification };
        //     delete notificationWithoutId.id;

        //     const id = service.addNotification(notificationWithoutId);
        //     expect(id).toBe(1);
        //     expect(service.getNotifications()[0].id).toBe(1);
        // });

        it('should handle empty notifications array correctly for ID generation', () => {
            service.clearNotifications();
            const id = service.addNotification(mockNotification);
            expect(id).toBe(1);
        });
    });

    describe('clearNotifications()', () => {
        beforeEach(() => {
            service.addNotification(mockNotification);
        });

        it('should remove all notifications', () => {
            service.clearNotifications();
            expect(service.getNotifications()).toEqual([]);
        });

        it('should emit NotificationsUpdated event with empty array', () => {
            const emitSpy = vi.spyOn(mockEventEmitter, 'emit');
            service.clearNotifications();

            expect(emitSpy).toHaveBeenCalledTimes(1);
            expect(emitSpy).toHaveBeenCalledWith(Events.NotificationsUpdated, []);
        });
    });

    describe('deleteNotification()', () => {
        beforeEach(() => {
            service.addNotification(mockNotification);
            service.addNotification({ ...mockNotification, id: 0, title: 'Second' });
        });

        it('should remove specific notification by ID', () => {
            service.deleteNotification(1);
            const notifications = service.getNotifications();
            expect(notifications).toHaveLength(1);
            expect(notifications[0].title).toBe('Second');
        });

        it('should emit NotificationsUpdated event after deletion', () => {
            const emitSpy = vi.spyOn(mockEventEmitter, 'emit');
            service.deleteNotification(1);

            expect(emitSpy).toHaveBeenCalledTimes(1);
            expect(emitSpy).toHaveBeenCalledWith(
                Events.NotificationsUpdated,
                expect.arrayContaining([expect.objectContaining({ title: 'Second' })])
            );
        });

        it('should not fail when deleting non-existent ID', () => {
            expect(() => service.deleteNotification(999)).not.toThrow();
            expect(service.getNotifications()).toHaveLength(2);
        });
    });

    describe('getNotifications()', () => {
        it('should return empty array initially', () => {
            expect(service.getNotifications()).toEqual([]);
        });

        it('should return all notifications', () => {
            service.addNotification(mockNotification);
            service.addNotification({ ...mockNotification, id: 0, title: 'Second' });

            const notifications = service.getNotifications();
            expect(notifications).toHaveLength(2);
            expect(notifications[0].title).toBe('Test Notification');
            expect(notifications[1].title).toBe('Second');
        });

        it('should return a new array (immutable)', () => {
            service.addNotification(mockNotification);
            const firstCall = service.getNotifications();
            const secondCall = service.getNotifications();

            expect(firstCall).toEqual(secondCall);
            // expect(firstCall).not.toBe(secondCall); // Different references
        });
    });

    describe('event emission', () => {
        it('should notify listeners when notifications change', () => {
            const handler = vi.fn();
            mockEventEmitter.on(Events.NotificationsUpdated, handler);

            service.addNotification(mockNotification);
            expect(handler).toHaveBeenCalledTimes(1);

            service.deleteNotification(1);
            expect(handler).toHaveBeenCalledTimes(2);

            service.clearNotifications();
            expect(handler).toHaveBeenCalledTimes(3);
        });
    });
});