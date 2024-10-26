import { ActionTypes } from "../../actions";
import { History } from "../history.decorator";

@History(ActionTypes.ON_NEW_GITHUB_REPOSITORY)
export class OnNewGithubRepositoryHistory {
  type: ActionTypes.ON_NEW_GITHUB_REPOSITORY;
  lastCreationTimestamp: number = 0;
}
