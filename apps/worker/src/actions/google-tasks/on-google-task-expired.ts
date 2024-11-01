import { ActionFunction } from "../action-function";
import {
  MongoDBService,
  AreaPacket,
  getAuthorizationToken,
  AuthorizationsTypes,
  OnGoogleTaskExpiredInfos,
  getGoogleTasksByListId,
  getGoogleTaskListByName,
  OnGoogleTaskExpiredHistory,
} from "@area/shared";

export const handleOnGoogleTaskExpiredAction: ActionFunction = async (
  packet: AreaPacket,
  database: MongoDBService,
) => {
  const { token } = await getAuthorizationToken(
    packet.user_id,
    AuthorizationsTypes.GOOGLE,
    database,
  );

  const area = packet.area;
  const action = area.action.informations as OnGoogleTaskExpiredInfos;
  const history = area.action.history as OnGoogleTaskExpiredHistory;

  let listId = "@default";
  if (action.list_name && action.list_name.length > 0) {
    const id = await getGoogleTaskListByName(token, action.list_name);
    if (!id) {
      throw new Error(`List ${action.list_name} not found`);
    }
    listId = id;
  }

  const tasks = (await getGoogleTasksByListId(token, listId)).filter(
    (task) => task.id && task.due,
  );

  const now = new Date();

  if (!history.taskIds) {
    history.taskIds = tasks
      .filter((task) => new Date(task.due || 0) < now)
      .map((task: any) => task.id);
    area.action.history = history;
    await database.updateAreaHistory(packet.user_id, area);
    return null;
  }

  if (tasks.length === 0) {
    return null;
  }

  const passedTasks = tasks
    .filter((task: any) => new Date(task.due || 0) < now)
    .filter((task: any) => !history.taskIds?.includes(task.id));

  let task = null;

  history.taskIds = tasks
    .filter((task) => new Date(task.due || 0) < now)
    .filter((task) => history.taskIds?.includes(task.id || ""))
    .map((task: any) => task.id);

  if (passedTasks.length > 0) {
    task = passedTasks[0];
    history.taskIds?.push(task.id as string);
  }
  area.action.history = history;

  await database.updateAreaHistory(packet.user_id, area);

  if (!task) {
    return null;
  }

  packet.data = {
    task_id: task.id,
    title: task.title,
    body: task.notes,
    due_date: task.due ? new Date(task.due).toString() : undefined,
    due_date_string: task.due
      ? new Date(task.due).toLocaleDateString()
      : undefined,
    due_time_string: task.due
      ? new Date(task.due).toLocaleTimeString()
      : undefined,
    status: task.status,
    updated_at: task.updated ? new Date(task.updated).toString() : undefined,
    update_time: task.updated
      ? new Date(task.updated).toLocaleTimeString()
      : undefined,
    update_date: task.updated
      ? new Date(task.updated).toLocaleDateString()
      : undefined,
    list_name: action.list_name ? action.list_name : "Your tasks",
    list_id: listId,
  };

  return packet;
};
