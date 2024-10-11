import { Action, ActionInfos } from '@area/shared';

export abstract class ActionBuilder {
  abstract build(dto: ActionInfos): Action;
}
