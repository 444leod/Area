import { ClassConstructor } from "class-transformer";
import { ReactionTypes } from "./reaction-types.enum";

export class ReactionRegistry {
  private static registry: Map<ReactionTypes, any> = new Map();

  static register(type: ReactionTypes, target: any) {
    this.registry.set(type, target);
  }

  static get sub_types(): {
    name: string;
    value: ClassConstructor<any>;
  }[] {
    return Array.from(ReactionRegistry.registry.entries()).map(
      ([type, value]) => ({
        value,
        name: type,
      }),
    );
  }
}

export function RegisterReaction(type: ReactionTypes) {
  return function (target: any) {
    ReactionRegistry.register(type, target);
    return target;
  };
}
