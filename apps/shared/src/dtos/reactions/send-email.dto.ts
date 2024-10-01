import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ReactionTypes } from "./reaction-types.dto";

export class SendEmailDTO {
  type: ReactionTypes.SEND_EMAIL;
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  to: string;

  @ApiProperty()
  @IsString()
  subject: string;

  @ApiProperty()
  @IsString()
  body: string;
}
