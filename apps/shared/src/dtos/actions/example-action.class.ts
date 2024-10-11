import { IsNotEmpty, IsString } from 'class-validator';
import { ActionTypes } from './action-types.enum';
import { BaseActionInfos } from './action-infos.class';

export class ExampleActionInfos extends BaseActionInfos {
  type: ActionTypes.EXAMPLE_ACTION;

  @IsString()
  @IsNotEmpty()
  exampleField: string;
}
