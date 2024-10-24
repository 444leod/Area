import { ActionFunction } from "../action-function";
import {
  EachXSecondsActionInfos,
  EachXSecondsHistoryDTO,
  MongoDBService,
  AreaPacket,
} from "@area/shared";

export const handleEachXSecondsAction: ActionFunction = async (
  packet: AreaPacket,
  database: MongoDBService,
) => {
  const area = packet.area;
  const action = area.action.informations as EachXSecondsActionInfos;
  const history = area.action.history as EachXSecondsHistoryDTO;

  let execute: boolean = false;

  if (history.lastExecutionTimestamp === undefined) {
    execute = true;
  } else if (
    Date.now() - history.lastExecutionTimestamp >=
    action.seconds * 1000
  ) {
    history.lastExecutionTimestamp = Date.now();
    execute = true;
  }

  if (!execute) return null;

  packet.area.action.history = history;

  await database.updateAreaHistory(packet.user_id, area);

  packet.data = {
    date: new Date().toLocaleDateString(),
    hour: new Date().toLocaleTimeString(),
    seconds: String(action.seconds),
  };

  return packet;
};
