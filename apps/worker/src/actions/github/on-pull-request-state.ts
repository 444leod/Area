import { ActionFunction } from "../action-function";
import {
  MongoDBService,
  AreaPacket,
  getRepositoryPullRequests,
  OnPullRequestStateClass,
  OnPullRequestStateHistoryDTO,
  getAuthorizationToken,
  AuthorizationsTypes,
} from "@area/shared";

export const handleOnPullRequestStateAction: ActionFunction = async (
  packet: AreaPacket,
  database: MongoDBService,
) => {
  const { token } = await getAuthorizationToken(
    packet.user_id,
    AuthorizationsTypes.GITHUB,
    database,
  );

  const area = packet.area;
  const action = area.action.informations as OnPullRequestStateClass;
  const history = area.action.history as OnPullRequestStateHistoryDTO;

  if (
    history.lastUpdateTimestamp === null ||
    history.lastUpdateTimestamp === undefined
  ) {
    history.lastUpdateTimestamp = new Date().getTime();
    area.action.history = history;
    await database.updateAreaHistory(packet.user_id, area);
    return null;
  }
  let prs = await getRepositoryPullRequests({
    token: token,
    owner: action.owner,
    repo: action.repository,
    since: new Date(history.lastUpdateTimestamp),
    state: action.state,
    sort: "updated_at",
    direction: "desc",
  });

  if (!prs) return null;

  prs = prs.filter((pr: any) => {
    return new Date(pr.updated_at).getTime() > history.lastUpdateTimestamp;
  });

  if (prs.length === 0) return null;

  const pr = prs[prs.length - 1];

  history.lastUpdateTimestamp = new Date(pr.updated_at).getTime();
  area.action.history = history;
  await database.updateAreaHistory(packet.user_id, area);

  packet.data = {
    title: pr.title,
    description: pr.body || "",
    url: pr.html_url,
    state: pr.state,
    number: String(pr.number),
    creator: pr.user.login,
    creator_picture_url: pr.user.avatar_url,
    created_at: new Date(pr.created_at).toDateString(),
    creation_time: new Date(pr.created_at).toLocaleTimeString(),
    creation_date: new Date(pr.created_at).toLocaleDateString(),
    updated_at: new Date(pr.updated_at).toDateString(),
    merged_at: pr.merged_at ? new Date(pr.merged_at).toDateString() : "",
  };

  return packet;
};
