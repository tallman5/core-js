export type EventHandler<T = any> = (...args: T[]) => void;

export class EventEmitter<TEvents extends Record<string, any>> {
    private events: { [K in keyof TEvents]?: EventHandler<TEvents[K]>[] } = {};

    on<K extends keyof TEvents>(event: K, listener: EventHandler<TEvents[K]>) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event]?.push(listener);
    }

    off<K extends keyof TEvents>(event: K, listener: EventHandler<TEvents[K]>) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event]?.filter(l => l !== listener);
    }

    emit<K extends keyof TEvents>(event: K, ...args: TEvents[K][]) {
        this.events[event]?.forEach(listener => listener(...args));
    }
}
