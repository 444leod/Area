import { ActionTypes } from "../../actions";
import { History } from "../history.decorator";

@History(ActionTypes.ON_NEW_GITHUB_REPOSITORY)
export class OnNewGithubRepositoryHistoryDTO {
  type: ActionTypes.ON_NEW_GITHUB_REPOSITORY;
  lastCreationTimestamp: number = 0;
}
