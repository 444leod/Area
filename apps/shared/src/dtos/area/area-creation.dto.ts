import { ApiProperty } from "@nestjs/swagger";
import { AnyActionDTO } from "../actions";
import { AnyReactionDTO } from "../reactions";

export class AreaCreationDto {
  @ApiProperty({
    description:
      "The ActionDTO",
  })
  action: AnyActionDTO;

  @ApiProperty({
    description:
      "The ReactionDTO",
  })
  reaction: AnyReactionDTO;
}
