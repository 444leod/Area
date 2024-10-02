import { ActionFunctions } from '../action-functions';
import { EachXSecondsDTO, EachXSecondsHistoryDTO, MongoDBService, AreaPacket } from '@area/shared';

export const handleEachXSecondsAction: ActionFunctions = async (packet: AreaPacket, database: MongoDBService) => {
    console.log('each x seconds function handling (action)!');
    const area = packet.area;
    const action = area.action.informations as EachXSecondsDTO;
    const history = area.action.history as EachXSecondsHistoryDTO;

    let execute: boolean = false;

    console.log('action:', action);
    console.log('history:', history);

    if (history.lastExecutionTimestamp === undefined) {
        history.lastExecutionTimestamp = Date.now();
        execute = true;
    } else if (Date.now() - history.lastExecutionTimestamp >= action.seconds * 1000) {
        history.lastExecutionTimestamp = Date.now();
        execute = true;
    }

    console.log('execute:', execute);

    if (!execute) return null;

    console.log('new history:', history);
    packet.area.action.history = history;

    await database.updateAreaHistory(packet.userId, area);

    return packet;
};
