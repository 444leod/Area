import {IsNotEmpty, IsString, ValidateIf, ValidationArguments, ValidationOptions, registerDecorator, IsOptional} from "class-validator";
import { BaseReactionInfos } from "../reaction-infos.class";
import { ReactionTypes } from "../reaction-types.enum";

function IsDateOrMatchesRegex(regex: RegExp, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isDateOrMatchesRegex',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    // Check if it's a valid date
                    const isValidDate = !isNaN(Date.parse(value));
                    // Check if it matches the regex
                    const matchesRegex = regex.test(value);
                    return isValidDate || matchesRegex;
                },
                defaultMessage(args: ValidationArguments) {
                    return `Invalid value: Must be a valid date or be a {{variable}}`;
                },
            },
        });
    };
}

export class SendMessageToDiscordWebhookInfos extends BaseReactionInfos {
    type: ReactionTypes.SEND_MESSAGE_TO_DISCORD_WEBHOOK;

    @IsString()
    @IsNotEmpty()
    webhook_url: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    body?: string;


    @IsString()
    @IsOptional()
    username?: string;

    @IsString()
    @IsOptional()
    avatar_url?: string;

    @IsString()
    @IsOptional()
    thumbnail_url?: string;

    //
    // @ValidateIf((obj) => obj.date !== undefined)
    // @IsDateOrMatchesRegex(/{{(.*?)}}/g, { message: 'Must be a valid date or be a {{variable}}' })
    // date?: string;
}
