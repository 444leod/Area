import { ActionTypes } from "../action-types.enum";
import { BaseActionInfos } from "../action-infos.class";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { RegisterAction } from "../action.decorator";

enum NewArtistContentType {
  ALBUM = "ALBUM",
  SINGLE = "SINGLE",
  PLAYLIST = "PLAYLIST",
  PODCAST = "PODCAST",
  ANY = "ANY",
}

@RegisterAction(ActionTypes.ON_NEW_ARTIST_CONTENT)
export class OnNewArtistContentInfos extends BaseActionInfos {
  type: ActionTypes.ON_NEW_ARTIST_CONTENT;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  artist_id: string;

  @ApiProperty()
  @IsEnum(NewArtistContentType)
  @IsNotEmpty()
  content_type: NewArtistContentType;
}
