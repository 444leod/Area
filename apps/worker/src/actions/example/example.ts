import { ActionFunctions } from '../action-functions';
import { AreaPacket } from '@area/shared';

export const handleExampleAction: ActionFunctions = async (packet: AreaPacket) => {
    return packet;
};
