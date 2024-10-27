import { ActionTypes } from "../action-types.enum";
import { BaseActionInfos } from "../action-infos.class";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { RegisterAction } from "../action.decorator";

export enum NewArtistContentType {
  ALBUM = "album",
  SINGLE = "single",
  ANY = "any",
}

@RegisterAction(ActionTypes.ON_NEW_ARTIST_CONTENT)
export class OnNewArtistContentInfos extends BaseActionInfos {
  type: ActionTypes.ON_NEW_ARTIST_CONTENT;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  artist_name: string;

  @ApiProperty()
  @IsEnum(NewArtistContentType)
  @IsNotEmpty()
  content_type: NewArtistContentType;
}
