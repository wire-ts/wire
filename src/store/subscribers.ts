import { SubscribeFn } from "../common";

export default class Subscribers {
  private i = 0;
  private subscribers = new Map<number, SubscribeFn>();

  add = (f: SubscribeFn) => {
    const index = this.i;
    this.subscribers.set(index, f);
    this.i++;

    return () => this.subscribers.delete(index);
  };

  broadcast = (method: string) => {
    for (const callback of this.subscribers.values()) {
      callback(method);
    }
  };
}
