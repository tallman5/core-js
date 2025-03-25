import { describe, it, expect, vi } from 'vitest';
import { AppUserService } from './app-user.service';
import { EventEmitter } from '../event-emitter';
import { IAppUser } from './app-user.model';

type AppUserEvents = {
    AppUserChanged: IAppUser;
};

describe('AppUserService', () => {
    it('should initialize with a guest user', () => {
        const eventEmitter = new EventEmitter<AppUserEvents>();
        const service = new AppUserService(eventEmitter);

        expect(service.getAppUser()).toEqual({ username: 'guest' });
    });

    it('should set a new user and emit an event', () => {
        const eventEmitter = new EventEmitter<AppUserEvents>();
        const service = new AppUserService(eventEmitter);
        const mockListener = vi.fn();

        eventEmitter.on("AppUserChanged", mockListener);
        const newUser = { username: 'john_doe' };
        service.setAppUser(newUser);

        expect(service.getAppUser()).toEqual(newUser);
        expect(mockListener).toHaveBeenCalledWith(newUser);
    });

    it('should clear the user and emit an event', () => {
        const eventEmitter = new EventEmitter<AppUserEvents>();
        const service = new AppUserService(eventEmitter);
        const mockListener = vi.fn();

        eventEmitter.on("AppUserChanged", mockListener);
        service.clearUser();

        expect(service.getAppUser()).toEqual({ username: 'guest' });
        expect(mockListener).toHaveBeenCalledWith({ username: 'guest' });
    });
});
