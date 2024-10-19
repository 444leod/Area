import { ActionBuilder } from './action.builder';
import { Action, ActionTypes, OnNewJiraProjectClass } from '@area/shared';

export class OnNewJiraProjectBuilder implements ActionBuilder {
    build(dto: OnNewJiraProjectClass): Action {
        return {
            is_webhook: false,
            service_id: undefined,
            informations: dto,
            history: {
                type: ActionTypes.ON_NEW_JIRA_PROJECT,
                projectList: undefined,
            },
        };
    }
}
