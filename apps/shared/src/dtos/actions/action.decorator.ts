import { ClassConstructor } from "class-transformer";
import { ActionTypes } from "../actions";

export class ActionRegistry {
  private static registry: Map<ActionTypes, any> = new Map();

  static register(type: ActionTypes, target: any) {
    this.registry.set(type, target);
  }

  static get sub_types(): {
    name: string,
    value: ClassConstructor<any>
  }[] {
    return Array.from(ActionRegistry.registry.entries()).map(([type, value]) => ({
      value,
      name: type
    }));
  }
}

export function RegisterAction(type: ActionTypes) {
  return function (target: any) {
    ActionRegistry.register(type, target);
    return target;
  };
}
