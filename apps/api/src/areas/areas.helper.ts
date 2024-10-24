import {
  ActionTypes,
  Area,
  AreaCreationDto,
  ReactionTypes,
  Reaction,
  Action,
  AreaDto,
  AuthorizationsTypes,
} from "@area/shared";
import { Injectable } from "@nestjs/common";
import { ActionBuilder } from "./builders/actions/action.builder";
import { ExampleActionBuilder } from "./builders/actions/example.builder";
import { EachXSecondsActionBuilder } from "./builders/actions/each-x-sec.builder";
import { OnYoutubeVideoPostedBuilder } from "./builders/actions/on-youtube-video-posted";
import { ObjectId } from "mongodb";
import { OnNewJiraTicketBuilder } from "./builders/actions/on-new-jira-ticket";
import { OnNewJiraProjectBuilder } from "./builders/actions/on-new-jira-project";
import { OnNewGithubRepositoryBuilder } from "./builders/actions/on-new-github-repository";
import { OnPullRequestStateBuilder } from "./builders/actions/on-pull-request-state";

@Injectable()
export class AreasHelper {

  private _actions_builders: Record<ActionTypes, ActionBuilder> = {
    EXAMPLE_ACTION: new ExampleActionBuilder(),
    EACH_X_SECONDS: new EachXSecondsActionBuilder(),
    ON_YOUTUBE_VIDEO_POSTED: new OnYoutubeVideoPostedBuilder(),
    ON_NEW_JIRA_TICKET: new OnNewJiraTicketBuilder(),
    ON_NEW_JIRA_PROJECT: new OnNewJiraProjectBuilder(),
    ON_NEW_GITHUB_REPOSITORY: new OnNewGithubRepositoryBuilder(),
    ON_PULL_REQUEST_STATE: new OnPullRequestStateBuilder(),
  };
  // TODO : replace with DB services
  private _reactions_services: Record<ReactionTypes, ObjectId | undefined> = {
    EXAMPLE_REACTION: undefined,
    SEND_EMAIL: undefined,
    CREATE_GOOGLE_TASK: undefined,
    SEND_MESSAGE_TO_DISCORD_WEBHOOK: undefined,
    CREATE_PULL_REQUEST_COMMENT: undefined,
  };

  build(dto: AreaCreationDto): Area {
    const action: Action = this._actions_builders[dto.action.type]?.build(
      dto.action,
    );
    const reaction: Reaction = {
      service_id: this._reactions_services[dto.reaction.type],
      informations: dto.reaction,
    };
    const area: Area = {
      _id: new ObjectId(),
      name: dto.name,
      action: action,
      reaction: reaction,
      active: true,
    };
    return area;
  }

  toDto(area: Area): AreaDto {
    return {
      _id: area._id,
      name: area.name,
      active: area.active,
      action: {
        service_id: area.action.service_id,
        informations: area.action.informations,
      },
      reaction: {
        service_id: area.reaction.service_id,
        informations: area.reaction.informations,
      },
    };
  }
}
