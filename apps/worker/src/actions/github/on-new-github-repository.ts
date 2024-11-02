import { ActionFunction } from "../action-function";
import {
  MongoDBService,
  AreaPacket,
  OnNewGithubRepositoryHistory,
  getSortedUserRepositoriesSince,
  getAuthorizationToken,
  AuthorizationsTypes,
} from "@area/shared";

export const handleNewGithubRepositoryAction: ActionFunction = async (
  packet: AreaPacket,
  database: MongoDBService,
) => {
  const { token } = await getAuthorizationToken(
    packet.user_id,
    AuthorizationsTypes.GITHUB,
    database,
  );

  const area = packet.area;
  const history = area.action.history as OnNewGithubRepositoryHistory;

  if (
    history.lastCreationTimestamp === null ||
    history.lastCreationTimestamp === undefined
  ) {
    history.lastCreationTimestamp = new Date().getTime();
    area.action.history = history;
    await database.updateAreaHistory(packet.user_id, area);
    return null;
  }
  let repos = await getSortedUserRepositoriesSince(
    token,
    new Date(history.lastCreationTimestamp),
    "created_at",
    "desc",
  );

  if (!repos) return null;

  repos = repos.filter((repo: any) => {
    return (
      new Date(repo.created_at).getTime() > (history.lastCreationTimestamp || 0)
    );
  });

  if (repos.length === 0) return null;

  const repo = repos[repos.length - 1];

  history.lastCreationTimestamp = new Date(repo.created_at).getTime();
  area.action.history = history;
  await database.updateAreaHistory(packet.user_id, area);

  packet.data = {
    name: repo.name,
    description: repo.description || "",
    owner: repo.owner?.login,
    owner_picture_url: repo.owner?.avatar_url,
    created_at: new Date(repo.created_at).toDateString(),
    creation_time: new Date(repo.created_at).toLocaleTimeString(),
    creation_date: new Date(repo.created_at).toLocaleDateString(),
    url: repo.html_url,
    visibility: repo.visibility,
  };

  return packet;
};
