import { describe, it, expect, vi } from 'vitest';
import { EventEmitter } from './event-emitter';

type TestEvents = {
    userUpdated: { id: string; name: string };
    notificationReceived: { message: string };
};

describe('EventEmitter', () => {
    it('should register and call an event listener', () => {
        const emitter = new EventEmitter<TestEvents>();
        const mockListener = vi.fn();

        emitter.on('userUpdated', mockListener);
        emitter.emit('userUpdated', { id: '123', name: 'Test User' });

        expect(mockListener).toHaveBeenCalledWith({ id: '123', name: 'Test User' });
    });

    it('should remove an event listener', () => {
        const emitter = new EventEmitter<TestEvents>();
        const mockListener = vi.fn();

        emitter.on('userUpdated', mockListener);
        emitter.off('userUpdated', mockListener);
        emitter.emit('userUpdated', { id: '123', name: 'Test User' });

        expect(mockListener).not.toHaveBeenCalled();
    });

    it('should handle multiple listeners for the same event', () => {
        const emitter = new EventEmitter<TestEvents>();
        const listener1 = vi.fn();
        const listener2 = vi.fn();

        emitter.on('notificationReceived', listener1);
        emitter.on('notificationReceived', listener2);
        emitter.emit('notificationReceived', { message: 'Hello World' });

        expect(listener1).toHaveBeenCalledWith({ message: 'Hello World' });
        expect(listener2).toHaveBeenCalledWith({ message: 'Hello World' });
    });

    it('should not throw when emitting an event with no listeners', () => {
        const emitter = new EventEmitter<TestEvents>();
        expect(() => emitter.emit('userUpdated', { id: '456', name: 'No Listener' })).not.toThrow();
    });
});
