export type EventHandler = (...args: any[]) => void;

export enum Events {
    AppUserChanged, 
    NotificationsUpdated,
};

export class EventEmitter {
    private events: { [key in Events]?: EventHandler[] } = {};

    on(event: Events, listener: EventHandler) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event]?.push(listener);
    }

    off(event: Events, listener: EventHandler) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event]?.filter(l => l !== listener);
    }

    emit(event: Events, ...args: any[]) {
        this.events[event]?.forEach(listener => listener(...args));
    }
}
