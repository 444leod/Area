import { ActionTypes } from "../actions";
import { AnyHistoryDTO } from "./any-history.dto";

export class HistoryRegistry {
    private static registry: Map<ActionTypes, new () => AnyHistoryDTO> = new Map();

    static register(type: ActionTypes, constructor: new () => AnyHistoryDTO) {
        this.registry.set(type, constructor);
    }

    static create(type: ActionTypes): AnyHistoryDTO {
        const Constructor = this.registry.get(type);
        if (!Constructor) {
            throw new Error(`No history class registered for type: ${type}`);
        }
        return new Constructor();
    }
}

export function History(type: ActionTypes) {
    return function <T extends { new(...args: any[]): AnyHistoryDTO }>(constructor: T) {
        HistoryRegistry.register(type, constructor);
        return constructor;
    };
}
