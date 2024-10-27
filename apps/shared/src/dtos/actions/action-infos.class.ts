import { IsEnum } from "class-validator";
import { ActionTypes } from "./action-types.enum";
import { ExampleActionInfos } from "./example-action.class";
import { EachXSecondsActionInfos } from "./timer/each-x-seconds.class";
import { OnYoutubeVideoPostedInfos } from "./youtube/on-youtube-video-posted.class";
import { OnNewJiraTicketInfos } from "./jira/on-new-jira-ticket.class";
import { OnNewJiraProjectInfos } from "./jira/on-new-jira-project.class";
import { OnNewGithubRepositoryInfos } from "./github/on-new-github-repository.class";
import { OnPullRequestStateInfos } from "./github/on-pull-request-state.class";
import { OnNewVideoInPlaylistInfos } from "./youtube/on-video-in-playlist.class";
import { OnNewArtistContentInfos } from "./spotify/on-new-artist-content.class";
import { OnSpotifyPlaylistUpdateInfos } from "./spotify/on-spotify-playlist-update.class";
import { ApiProperty } from "@nestjs/swagger";

export class BaseActionInfos {
  @ApiProperty()
  @IsEnum(ActionTypes)
  type: ActionTypes;
}

export type ActionInfos =
  | ExampleActionInfos
  | EachXSecondsActionInfos
  | OnYoutubeVideoPostedInfos
  | OnNewJiraTicketInfos
  | OnNewJiraProjectInfos
  | OnNewGithubRepositoryInfos
  | OnPullRequestStateInfos
  | OnNewVideoInPlaylistInfos
  | OnNewArtistContentInfos
  | OnSpotifyPlaylistUpdateInfos;
