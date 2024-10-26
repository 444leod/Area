import { ActionTypes } from "../actions";
import { AnyHistory } from "./any.history";

export class HistoryRegistry {
  private static registry: Map<ActionTypes, new () => AnyHistory> =
    new Map();

  static register(type: ActionTypes, constructor: new () => AnyHistory) {
    this.registry.set(type, constructor);
  }

  static create(type: ActionTypes): AnyHistory {
    const Constructor = this.registry.get(type);
    if (!Constructor) {
      throw new Error(`No history class registered for type: ${type}`);
    }
    return new Constructor();
  }
}

export function History(type: ActionTypes) {
  return function <T extends { new (...args: any[]): AnyHistory }>(
    constructor: T,
  ) {
    HistoryRegistry.register(type, constructor);
    return constructor;
  };
}
