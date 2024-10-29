import { ActionTypes } from "../action-types.enum";
import { BaseActionInfos } from "../action-infos.class";
import { RegisterAction } from "../action.decorator";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export enum RiotRegion {
  AMERICAS,
  ASIA,
  EUROPE,
  SEA
}

@RegisterAction(ActionTypes.ON_RIOT_GAME_END)
export class OnRiotGameEndInfos extends BaseActionInfos {
  type: ActionTypes.ON_RIOT_GAME_END;

  @IsString()
  @IsNotEmpty()
  player_name: string;

  @IsString()
  @IsNotEmpty()
  player_tag: string;

  @IsEnum(RiotRegion)
  region: string
}
