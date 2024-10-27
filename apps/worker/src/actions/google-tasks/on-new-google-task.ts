import { ActionFunction } from "../action-function";
import {
  MongoDBService,
  AreaPacket,
  OnNewGoogleTaskHistory,
  getAuthorizationToken,
  AuthorizationsTypes,
  OnNewGoogleTaskInfos,
  getGoogleTasksByListId,
  getGoogleTaskListByName,
} from "@area/shared";

export const handleOnNewGoogleTaskAction: ActionFunction = async (
  packet: AreaPacket,
  database: MongoDBService,
) => {
  const { token } = await getAuthorizationToken(
    packet.user_id,
    AuthorizationsTypes.GOOGLE,
    database,
  );

  const area = packet.area;
  const action = area.action.informations as OnNewGoogleTaskInfos;
  const history = area.action.history as OnNewGoogleTaskHistory;

  let listId = "@default";
  if (action.list_name && action.list_name.length > 0) {
    const id = await getGoogleTaskListByName(token, action.list_name);
    if (!id) {
      throw new Error(`List ${action.list_name} not found`);
    }
    listId = id;
  }

  const tasks = (await getGoogleTasksByListId(token, listId)).filter(
    (task) => task.id,
  );

  if (!history.taskIds) {
    history.taskIds = tasks.map((task: any) => task.id);
    area.action.history = history;
    await database.updateAreaHistory(packet.user_id, area);
    return null;
  }

  if (tasks.length === 0) {
    return null;
  }

  const newTasks = tasks.filter(
    (task: any) => !history.taskIds?.includes(task.id),
  );

  if (newTasks.length === 0) {
    return null;
  }

  const task = newTasks[0];

  history.taskIds = tasks
    .filter((task) => !newTasks.includes(task))
    .map((task) => task.id as string);
  history.taskIds?.push(task.id as string);
  area.action.history = history;

  await database.updateAreaHistory(packet.user_id, area);

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
    created_at: task.updated ? new Date(task.updated).toString() : undefined,
    creation_time: task.updated
      ? new Date(task.updated).toLocaleTimeString()
      : undefined,
    creation_date: task.updated
      ? new Date(task.updated).toLocaleDateString()
      : undefined,
    list_name: action.list_name ? action.list_name : "Your tasks",
    list_id: listId,
  };

  return packet;
};
