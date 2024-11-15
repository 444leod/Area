import { ExampleActionHistory } from "./example-action.history";
import { EachXSecondsHistory } from "./timer/each-x-seconds.history";
import { OnYoutubeVideoPostedHistory } from "./youtube/on-youtube-video-posted.history";
import { OnNewJiraTicketHistory } from "./jira/on-new-jira-ticket.history";
import { OnNewJiraProjectHistory } from "./jira/on-new-jira-project.history";
import { OnNewGithubRepositoryHistory } from "./github/on-new-github-repository.history";
import { OnPullRequestStateHistory } from "./github/on-pull-request-state.history";
import { OnNewVideoInPlaylistHistory } from "./youtube/on-video-in-playlist.history";
import { OnNewArtistContentHistory } from "./spotify/on-new-artist-content.history";
import { OnSpotifyPlaylistUpdateHistory } from "./spotify/on-spotify-playlist-update.history";
import { OnNewGoogleTaskHistory } from "./google-tasks/on-new-google-task.history";
import { OnGoogleTaskExpiredHistory } from "./google-tasks/on-google-task-expired.history";
import { OnRiotGameEndHistory } from "./riot/game-end-history.class";

export type AnyHistory =
  | ExampleActionHistory
  | EachXSecondsHistory
  | OnYoutubeVideoPostedHistory
  | OnNewJiraTicketHistory
  | OnNewJiraProjectHistory
  | OnNewGithubRepositoryHistory
  | OnPullRequestStateHistory
  | OnNewVideoInPlaylistHistory
  | OnNewArtistContentHistory
  | OnSpotifyPlaylistUpdateHistory
  | OnNewGoogleTaskHistory
  | OnGoogleTaskExpiredHistory
  | OnRiotGameEndHistory;
