import { ActionBuilder } from './action.builder';
import { Action, ActionTypes, OnNewGithubRepositoryClass } from '@area/shared';

export class OnNewGithubRepositoryBuilder implements ActionBuilder {
    build(dto: OnNewGithubRepositoryClass): Action {
        return {
            is_webhook: false,
            service_id: undefined,
            informations: dto,
            history: {
                type: ActionTypes.ON_NEW_GITHUB_REPOSITORY,
                lastCreationTimestamp: undefined,
            },
        };
    }
}
