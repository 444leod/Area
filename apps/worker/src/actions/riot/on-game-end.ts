import {
  getPlayerAccount,
  getPlayerGamesIds,
  OnRiotGameEndInfos,
  OnRiotGameEndHistory,
  getGameResults,
  RiotGameResults,
  ValidationError,
} from "@area/shared";
import { ActionFunction } from "../action-function";

export const handleRiotGameEnd: ActionFunction = async (packet, db) => {
  const history = packet.area.action.history as OnRiotGameEndHistory;
  const infos = packet.area.action.informations as OnRiotGameEndInfos;

  const token = process.env.RIOT_API_TOKEN || "";
  const account = await getPlayerAccount(
    infos.player_name,
    infos.player_tag,
    infos.region,
    token,
  );

  let gamesIds: string[] = await getPlayerGamesIds(account.puuid, infos.region, token);

  console.log("GAMEIDS:", gamesIds);

  if (gamesIds.length == 0 || history.last_game_id == gamesIds[0]) return null;
  if (history.last_game_id === null) {
    history.last_game_id = gamesIds[0];
    packet.area.action.history = history;
    await db.updateAreaHistory(packet.user_id, packet.area);
    return null;
  }

  const results: RiotGameResults = await getGameResults(
    account.puuid,
    gamesIds[0],
    infos.region,
    token,
  );
  packet.data = {
    player: `${infos.player_name}#${infos.player_tag}`,
    gamemode: results.gamemode,
    win: results.player.win,
    kills: results.player.kills,
    deaths: results.player.deaths,
    assists: results.player.assists,
    champion: results.player.championName,
  };

  history.last_game_id = gamesIds[0];
  packet.area.action.history = history;
  await db.updateAreaHistory(packet.user_id, packet.area);
  return packet;
};
