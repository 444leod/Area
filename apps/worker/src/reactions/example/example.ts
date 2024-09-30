import { ReactionFunction } from '../reactionFunction';
import { AreaDTO } from '@area/shared';

export const handleExampleReaction: ReactionFunction = async (area: AreaDTO) => {
    console.log('example function handling (reaction)!');
    return;
};
