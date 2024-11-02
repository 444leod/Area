import { handleOnNewGoogleTaskAction } from "./on-new-google-task";
import {
  MongoDBService,
  AreaPacket,
  getAuthorizationToken,
  OnNewGoogleTaskInfos,
  getGoogleTasksByListId,
  getGoogleTaskListByName,
  OnNewGoogleTaskHistory,
  ActionTypes,
} from "@area/shared";
import { ObjectId } from "mongodb";

// Mock dependencies
jest.mock("@area/shared", () => ({
  MongoDBService: jest.fn().mockImplementation(() => ({
    updateAreaHistory: jest.fn().mockResolvedValue(undefined),
  })),
  getAuthorizationToken: jest.fn(),
  getGoogleTasksByListId: jest.fn(),
  getGoogleTaskListByName: jest.fn(),
  AuthorizationsTypes: {
    GOOGLE: "GOOGLE",
  },
  ActionTypes: {
    ON_NEW_GOOGLE_TASK: "ON_NEW_GOOGLE_TASK",
  },
  ReactionTypes: {
    EXAMPLE_REACTION: "EXAMPLE_REACTION",
  },
}));

describe("handleOnNewGoogleTaskAction", () => {
  let database: MongoDBService;
  let areaPacket: AreaPacket;

  beforeEach(() => {
    database = new MongoDBService();
    areaPacket = {
      user_id: new ObjectId(),
      area: {
        _id: new ObjectId(),
        name: "Sample Area",
        action: {
          informations: {
            type: ActionTypes.ON_NEW_GOOGLE_TASK,
            list_name: "Sample List",
          } as OnNewGoogleTaskInfos,
          service_id: new ObjectId(),
          history: {
            type: ActionTypes.ON_NEW_GOOGLE_TASK,
            taskIds: [],
          } as OnNewGoogleTaskHistory,
          is_webhook: false,
        },
        reaction: {
          informations: {
            type: "EXAMPLE_REACTION",
            exampleField: "",
          },
          service_id: new ObjectId(),
        },
        active: false,
        logs: [],
      },
      data: {},
      authorizations: [],
    } as AreaPacket;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error if the specified list is not found", async () => {
    (getAuthorizationToken as jest.Mock).mockResolvedValue({
      token: "mockToken",
    });
    (getGoogleTaskListByName as jest.Mock).mockResolvedValue(null);

    await expect(
      handleOnNewGoogleTaskAction(areaPacket, database),
    ).rejects.toThrow(
      // @ts-ignore
      `List ${areaPacket.area.action.informations.list_name} not found`,
    );
    expect(getGoogleTaskListByName).toHaveBeenCalledWith(
      "mockToken",
      "Sample List",
    );
  });

  it("should initialize history with new tasks if taskIds is undefined", async () => {
    const newTask = { id: "task1" };
    (getAuthorizationToken as jest.Mock).mockResolvedValue({
      token: "mockToken",
    });
    (getGoogleTaskListByName as jest.Mock).mockResolvedValue("sampleListId");
    (getGoogleTasksByListId as jest.Mock).mockResolvedValue([newTask]);
    // @ts-ignore
    delete areaPacket.area.action.history.taskIds;

    const result = await handleOnNewGoogleTaskAction(areaPacket, database);

    expect(result).toBeNull();
    expect(database.updateAreaHistory).toHaveBeenCalledWith(
      areaPacket.user_id,
      areaPacket.area,
    );
    // @ts-ignore
    expect(areaPacket.area.action.history.taskIds).toEqual([newTask.id]);
  });

  it("should return null if no tasks are returned from Google", async () => {
    (getAuthorizationToken as jest.Mock).mockResolvedValue({
      token: "mockToken",
    });
    (getGoogleTaskListByName as jest.Mock).mockResolvedValue("sampleListId");
    (getGoogleTasksByListId as jest.Mock).mockResolvedValue([]);

    const result = await handleOnNewGoogleTaskAction(areaPacket, database);

    expect(result).toBeNull();
  });

  it("should return packet with data for new tasks not in history", async () => {
    const mockTask = {
      id: "task2",
      title: "New Task",
      notes: "Task notes",
      due: new Date().toISOString(),
      status: "needsAction",
      updated: new Date().toISOString(),
    };
    (getAuthorizationToken as jest.Mock).mockResolvedValue({
      token: "mockToken",
    });
    (getGoogleTaskListByName as jest.Mock).mockResolvedValue("sampleListId");
    (getGoogleTasksByListId as jest.Mock).mockResolvedValue([mockTask]);
    areaPacket.area.action.history = {
      type: ActionTypes.ON_NEW_GOOGLE_TASK,
      taskIds: ["task1"],
    };

    const result = await handleOnNewGoogleTaskAction(areaPacket, database);

    expect(result).not.toBeNull();
    expect(result?.data).toEqual({
      task_id: mockTask.id,
      title: mockTask.title,
      body: mockTask.notes,
      due_date: new Date(mockTask.due).toString(),
      due_date_string: new Date(mockTask.due).toLocaleDateString(),
      due_time_string: new Date(mockTask.due).toLocaleTimeString(),
      status: mockTask.status,
      created_at: new Date(mockTask.updated).toString(),
      creation_time: new Date(mockTask.updated).toLocaleTimeString(),
      creation_date: new Date(mockTask.updated).toLocaleDateString(),
      list_name: "Sample List",
      list_id: "sampleListId",
    });
    expect(database.updateAreaHistory).toHaveBeenCalledWith(
      areaPacket.user_id,
      areaPacket.area,
    );
  });
});
