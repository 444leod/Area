import { ActionFunction } from '../actionFunction';
import { AreaDTO } from '@area/shared';

export const handleExampleAction: ActionFunction = async (area: AreaDTO) => {
    console.log('example function handling (action)!');
    return area;
};
