import {
  IsNotEmpty,
  IsString,
  IsOptional,
} from "class-validator";
import { BaseReactionInfos } from "../reaction-infos.class";
import { ApiProperty } from "@nestjs/swagger";
import { ReactionTypes } from "../reaction-types.enum";
import { RegisterReaction } from "../reaction.decorator";

@RegisterReaction(ReactionTypes.CREATE_JIRA_TICKET)
export class CreateJiraTicketInfos extends BaseReactionInfos {
  type: ReactionTypes.CREATE_JIRA_TICKET;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    project_key: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    issue_type: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    assignee_name?: string;
}
