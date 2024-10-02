import { ApiProperty } from "@nestjs/swagger";
import {
  ActionInfos,
  ActionTypes,
  BaseActionInfos,
  ExampleActionInfos,
} from "../actions";
import {
  ExampleReactionInfos,
  ReactionInfos,
  ReactionTypes,
  SendEmailReactionInfos,
} from "../reactions";
import { IsNotEmptyObject, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class AreaCreationDto {
  @ApiProperty()
  @IsNotEmptyObject()

  /* This basically tells the Pipeline to validate sub-objects
   ** with a specific type if a property meets a certain value */
  @ValidateNested()
  @Type(() => BaseActionInfos, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: "type",
      subTypes: [
        { value: ExampleActionInfos, name: ActionTypes.EXAMPLE_ACTION },
      ],
    },
  })
  action: ActionInfos;

  @ApiProperty()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => BaseActionInfos, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: "type",
      subTypes: [
        { value: ExampleReactionInfos, name: ReactionTypes.EXAMPLE_REACTION },
        { value: SendEmailReactionInfos, name: ReactionTypes.SEND_EMAIL },
      ],
    },
  })
  reaction: ReactionInfos;
}
