import { google } from "googleapis";

function getTasks(token: string) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL,
  );

  oauth2Client.setCredentials({
    access_token: token,
  });

  return google.tasks({
    version: "v1",
    auth: oauth2Client,
  });
}

export async function createGoogleTask(
  token: string,
  title: string,
  body: string,
) {
  const tasks = getTasks(token);

  try {
    await tasks.tasks.insert({
      tasklist: "@default",
      requestBody: {
        title: title,
        notes: body,
      },
    });
  } catch (error: any) {
    throw new Error(`Error creating Google Task: ${error.message}`);
  }
}

export async function getGoogleTaskListByName(token: string, listName: string): Promise<string | null> {
  const tasks = getTasks(token);

  try {
    const response = await tasks.tasklists.list({});

    const taskList = response.data.items?.find(
      (list) => list.title === listName,
    );

    if (!taskList) {
      return null;
    }

    return taskList.id;
  } catch (error: any) {
    throw new Error(`Error fetching Google Tasks lists: ${error.message}`);
  }
}

export async function getGoogleTasksByListId(
  token: string,
  listId: string,
) {
  const tasks = getTasks(token);

  try {
    const tasksResponse = await tasks.tasks.list({
      tasklist: listId,
      showCompleted: true,
      showHidden: false,
    });

    return tasksResponse.data.items;
  } catch (error: any) {
    console.error(error.response.data);
    throw new Error(`Error fetching Google Tasks: ${error.message}`);
  }
}
