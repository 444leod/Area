import { ActionFunction } from '../action-function';
import { AreaPacket } from '@area/shared';

export const handleExampleAction: ActionFunction = async (packet: AreaPacket) => {
  return packet;
};
