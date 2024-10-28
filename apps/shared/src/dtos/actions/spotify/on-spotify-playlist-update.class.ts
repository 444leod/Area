import { ActionTypes } from "../action-types.enum";
import { BaseActionInfos } from "../action-infos.class";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { RegisterAction } from "../action.decorator";

export enum SpotifyPlaylistUpdateType {
  TITLE = "title",
  DESCRIPTION = "description",
  ADD = "add",
  REMOVE = "remove",
  ANY = "any",
}

@RegisterAction(ActionTypes.ON_SPOTIFY_PLAYLIST_UPDATE)
export class OnSpotifyPlaylistUpdateInfos extends BaseActionInfos {
  type: ActionTypes.ON_SPOTIFY_PLAYLIST_UPDATE;

  @ApiProperty()
  @IsString()
  @IsOptional()
  playlist_id: string;

  @ApiProperty()
  @IsEnum(SpotifyPlaylistUpdateType)
  @IsNotEmpty()
  update_type: SpotifyPlaylistUpdateType;
}
