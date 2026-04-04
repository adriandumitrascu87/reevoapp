
type Callback = (...args: any[]) => void;

class EventBus {
  private listeners: Record<string, Callback[]> = {};

  on(event: string, fn: Callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(fn);
  }

  off(event: string, fn: Callback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(listener => listener !== fn);
  }

  emit(event: string, ...args: any[]) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(fn => fn(...args));
  }
}

export const eventBus = new EventBus();