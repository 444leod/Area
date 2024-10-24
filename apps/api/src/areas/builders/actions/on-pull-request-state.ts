import { ActionBuilder } from "./action.builder";
import { Action, ActionTypes, OnPullRequestStateClass } from "@area/shared";

export class OnPullRequestStateBuilder implements ActionBuilder {
  build(dto: OnPullRequestStateClass): Action {
    return {
      is_webhook: false,
      service_id: undefined,
      informations: dto,
      history: {
        type: ActionTypes.ON_PULL_REQUEST_STATE,
        lastUpdateTimestamp: undefined,
      },
    };
  }
}
