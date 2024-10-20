import { ActionTypes } from "../action-types.enum";
import { BaseActionInfos } from "../action-infos.class";

export class OnNewGithubRepositoryClass extends BaseActionInfos {
    type: ActionTypes.ON_NEW_GITHUB_REPOSITORY;
}