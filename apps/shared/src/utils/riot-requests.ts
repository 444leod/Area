import axios, { Axios, AxiosResponse } from "axios";

export interface RiotAccountResponse {
  puuid: string,
  gameName: string,
  tagLine: string
}

interface RiotGameParticipant {
  puuid: string,
  kills: number,
  deaths: number,
  assists: number,
  champion: string,
  win: boolean
}

export interface RiotGameResults {
  gamemode: string,
  player: RiotGameParticipant
}

interface RiotGameResponse {
  info: {
    gameMode: string,
    participants: RiotGameParticipant[]
  }
}

export async function getPlayerAccount(
  name: string,
  tag: string,
  region: string,
  token: string
): Promise<RiotAccountResponse> {
  const base_url = `https://${region.toLowerCase()}.api.riotgames.com/`;
  const param_url = `riot/account/v1/accounts/by-riot-id/${name}/${tag}`;
  const res: AxiosResponse<RiotAccountResponse> = await axios.get(
    base_url + param_url,
    {
      params: {
        "api_key": token
      }
    }
  );
  return res.data;
}

export async function getPlayerGamesIds(
  puuid: string,
  region: string,
  token: string
): Promise<string[]> {
  const base_url = `https://${region.toLowerCase()}.api.riotgames.com/`;
  const param_url = `lol/match/v5/matches/by-puuid/${puuid}/ids`;
  const res: AxiosResponse<string[]> = await axios.get(
    base_url + param_url,
    {
      params: {
        "api_key": token
      }
    }
  );
  return res.data;
}

export async function getGameResults(
  puuid: string,
  gameid: string,
  region: string,
  token: string
): Promise<RiotGameResults> {
  const base_url = `https://${region.toLowerCase()}.api.riotgames.com/`;
  const param_url = `lol/match/v5/matches/${gameid}`;
  const res: AxiosResponse<RiotGameResponse> = await axios.get(
    base_url + param_url,
    {
      params: {
        "api_key": token
      }
    }
  );
  const result: RiotGameResults = {
    gamemode: res.data.info.gameMode,
    player: res.data.info.participants.find(p => p.puuid === puuid)
  }
  return result;
}
