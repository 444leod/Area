import { IsEnum } from "class-validator";
import { ActionTypes } from "./action-types.enum";
import { ExampleActionInfos } from "./example-action.class";
import { EachXSecondsActionInfos } from "./timer/each-x-seconds.class";
import { OnYoutubeVideoPostedClass } from "./youtube/on-youtube-video-posted.class";
import { OnNewJiraTicketClass } from "./jira/on-new-jira-ticket.class";
import { OnNewJiraProjectClass } from "./jira/on-new-jira-project.class";
import { OnNewGithubRepositoryClass } from "./github/on-new-github-repository.class";
import { ApiProperty } from "@nestjs/swagger";

export class BaseActionInfos {
  @ApiProperty()
  @IsEnum(ActionTypes)
  type: ActionTypes;
}

export type ActionInfos =
  | ExampleActionInfos
  | EachXSecondsActionInfos
  | OnYoutubeVideoPostedClass
  | OnNewJiraTicketClass
  | OnNewJiraProjectClass
  | OnNewGithubRepositoryClass;
