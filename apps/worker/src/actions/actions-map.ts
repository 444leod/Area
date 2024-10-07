import { ActionFunction } from './action-function';
import { handleExampleAction } from './example/example';
import { handleEachXSecondsAction } from './timer/each-x-seconds-action';
import { handleYoutubeVideoPostedAction } from './youtube/on-youtube-video-posted';

type ActionMap = {
    [string: string]: ActionFunction;
};

export const actionsMap: ActionMap = {
    EXAMPLE_ACTION: handleExampleAction,
    EACH_X_SECONDS: handleEachXSecondsAction,
    ON_YOUTUBE_VIDEO_POSTED: handleYoutubeVideoPostedAction,
};
