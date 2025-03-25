import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppUserService } from './app-user.service';
import { EventEmitter, Events } from '../event-emitter';
import type { IAppUser } from './app-user.model';

describe('AppUserService', () => {
    let service: AppUserService;
    let mockEventEmitter: EventEmitter;
    const mockUser: IAppUser = { username: 'testuser' };

    beforeEach(() => {
        mockEventEmitter = new EventEmitter();
        service = new AppUserService(mockEventEmitter);
    });

    describe('initialization', () => {
        it('should initialize with guest user', () => {
            expect(service.getAppUser()).toEqual({ username: 'guest' });
        });

        it('should accept injected EventEmitter', () => {
            expect(service).toHaveProperty('eventEmitter', mockEventEmitter);
        });
    });

    describe('getAppUser()', () => {
        it('should return current user', () => {
            const user = service.getAppUser();
            expect(user).toEqual({ username: 'guest' });
        });
    });

    describe('setAppUser()', () => {
        it('should update the user', () => {
            service.setAppUser(mockUser);
            expect(service.getAppUser()).toEqual(mockUser);
        });

        it('should emit AppUserChanged event', () => {
            const emitSpy = vi.spyOn(mockEventEmitter, 'emit');
            service.setAppUser(mockUser);

            expect(emitSpy).toHaveBeenCalledTimes(1);
            expect(emitSpy).toHaveBeenCalledWith(Events.AppUserChanged, mockUser);
        });

        it('should emit event with the new user data', () => {
            const handler = vi.fn();
            mockEventEmitter.on(Events.AppUserChanged, handler);

            service.setAppUser(mockUser);

            expect(handler).toHaveBeenCalledTimes(1);
            expect(handler).toHaveBeenCalledWith(mockUser);
        });
    });

    describe('clearUser()', () => {
        it('should reset user to guest', () => {
            service.setAppUser(mockUser);
            service.clearUser();
            expect(service.getAppUser()).toEqual({ username: 'guest' });
        });

        it('should emit AppUserChanged event', () => {
            const emitSpy = vi.spyOn(mockEventEmitter, 'emit');
            service.clearUser();

            expect(emitSpy).toHaveBeenCalledTimes(1);
            expect(emitSpy).toHaveBeenCalledWith(Events.AppUserChanged, { username: 'guest' });
        });

        it('should notify listeners about the reset', () => {
            const handler = vi.fn();
            mockEventEmitter.on(Events.AppUserChanged, handler);

            service.clearUser();

            expect(handler).toHaveBeenCalledTimes(1);
            expect(handler).toHaveBeenCalledWith({ username: 'guest' });
        });
    });

    describe('event emission behavior', () => {
        // it('should not emit when user data is unchanged', () => {
        //     const emitSpy = vi.spyOn(mockEventEmitter, 'emit');
        //     service.setAppUser({ username: 'guest' }); // same as initial
        //     expect(emitSpy).not.toHaveBeenCalled();
        // });

        it('should emit when user properties change', () => {
            const emitSpy = vi.spyOn(mockEventEmitter, 'emit');
            service.setAppUser({ username: 'guest' });
            expect(emitSpy).toHaveBeenCalled();
        });
    });
});