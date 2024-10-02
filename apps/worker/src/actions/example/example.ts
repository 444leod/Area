import { ActionFunction } from '../actionFunction';
import { Area } from '@area/shared';

export const handleExampleAction: ActionFunction = async (area: Area) => {
    console.log('example function handling (action)!');
    return area;
};
