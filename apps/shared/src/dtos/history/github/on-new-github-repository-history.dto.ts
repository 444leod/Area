import { ActionTypes } from "../../actions";

export interface OnNewGithubRepositoryHistoryDTO {
    type: ActionTypes.ON_NEW_GITHUB_REPOSITORY;
    lastCreationTimestamp: number;
}