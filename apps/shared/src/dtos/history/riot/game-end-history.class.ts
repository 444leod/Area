import { ActionTypes } from "../../actions";
import { History } from "../history.decorator";

@History(ActionTypes.ON_RIOT_GAME_END)
export class OnRiotGameEndHistory {
  type: ActionTypes.ON_RIOT_GAME_END;
  last_game_id: string = undefined;
}
