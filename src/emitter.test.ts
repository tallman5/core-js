import { EventEmitter, Events } from './event-emitter';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('EventEmitter', () => {
    let emitter: EventEmitter;
    const mockHandler = vi.fn();
    const mockHandler2 = vi.fn();

    beforeEach(() => {
        emitter = new EventEmitter();
        mockHandler.mockClear();
        mockHandler2.mockClear();
    });

    describe('on()', () => {
        it('should register event handlers', () => {
            emitter.on(Events.AppUserChanged, mockHandler);
            emitter.emit(Events.AppUserChanged);
            expect(mockHandler).toHaveBeenCalledTimes(1);
        });

        it('should allow multiple handlers for the same event', () => {
            emitter.on(Events.AppUserChanged, mockHandler);
            emitter.on(Events.AppUserChanged, mockHandler2);
            emitter.emit(Events.AppUserChanged);
            expect(mockHandler).toHaveBeenCalledTimes(1);
            expect(mockHandler2).toHaveBeenCalledTimes(1);
        });

        it('should not interfere with different events', () => {
            emitter.on(Events.AppUserChanged, mockHandler);
            emitter.emit(Events.NotificationsUpdated);
            expect(mockHandler).not.toHaveBeenCalled();
        });
    });

    describe('off()', () => {
        it('should remove specified handler', () => {
            emitter.on(Events.AppUserChanged, mockHandler);
            emitter.on(Events.AppUserChanged, mockHandler2);
            emitter.off(Events.AppUserChanged, mockHandler);
            emitter.emit(Events.AppUserChanged);
            expect(mockHandler).not.toHaveBeenCalled();
            expect(mockHandler2).toHaveBeenCalledTimes(1);
        });

        it('should do nothing if handler not registered', () => {
            emitter.on(Events.AppUserChanged, mockHandler);
            emitter.off(Events.AppUserChanged, mockHandler2); // not registered
            emitter.emit(Events.AppUserChanged);
            expect(mockHandler).toHaveBeenCalledTimes(1);
        });

        it('should do nothing if event has no handlers', () => {
            emitter.off(Events.AppUserChanged, mockHandler);
            emitter.emit(Events.AppUserChanged);
            expect(mockHandler).not.toHaveBeenCalled();
        });
    });

    describe('emit()', () => {
        it('should call all handlers with provided arguments', () => {
            const testArgs = ['arg1', 42, { key: 'value' }];
            emitter.on(Events.AppUserChanged, mockHandler);
            emitter.emit(Events.AppUserChanged, ...testArgs);
            expect(mockHandler).toHaveBeenCalledWith(...testArgs);
        });

        it('should not throw when emitting unregistered event', () => {
            expect(() => emitter.emit(Events.NotificationsUpdated)).not.toThrow();
        });

        it('should maintain proper order of handler execution', () => {
            const callOrder: number[] = [];
            const handler1 = () => callOrder.push(1);
            const handler2 = () => callOrder.push(2);

            emitter.on(Events.AppUserChanged, handler1);
            emitter.on(Events.AppUserChanged, handler2);
            emitter.emit(Events.AppUserChanged);

            expect(callOrder).toEqual([1, 2]);
        });
    });

    describe('edge cases', () => {
        // it('should handle multiple add/remove of same handler', () => {
        //     emitter.on(Events.AppUserChanged, mockHandler);
        //     emitter.on(Events.AppUserChanged, mockHandler); // duplicate
        //     emitter.off(Events.AppUserChanged, mockHandler);
        //     emitter.emit(Events.AppUserChanged);
        //     expect(mockHandler).toHaveBeenCalledTimes(1); // only one should remain
        // });

        it('should work correctly after removing all handlers', () => {
            emitter.on(Events.AppUserChanged, mockHandler);
            emitter.off(Events.AppUserChanged, mockHandler);
            emitter.emit(Events.AppUserChanged);
            expect(mockHandler).not.toHaveBeenCalled();
        });
    });
});