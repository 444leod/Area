import { ActionBuilder } from './action.builder';
import { Action, ActionTypes, OnNewJiraTicketClass } from '@area/shared';

export class OnNewJiraTicketBuilder implements ActionBuilder {
    build(dto: OnNewJiraTicketClass): Action {
        return {
            is_webhook: false,
            service_id: undefined,
            informations: dto,
            history: {
                type: ActionTypes.ON_NEW_JIRA_TICKET,
                lastCreationTimestamp: undefined,
            },
        };
    }
}
