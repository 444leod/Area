import { handleOnGoogleTaskExpiredAction } from "./on-google-task-expired";
import {
  MongoDBService,
  AreaPacket,
  getAuthorizationToken,
  OnGoogleTaskExpiredInfos,
  getGoogleTasksByListId,
  getGoogleTaskListByName,
  OnGoogleTaskExpiredHistory,
  ActionTypes,
  ReactionTypes,
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
  ReactionTypes: {
    EXAMPLE_REACTION: "EXAMPLE_REACTION",
  },
  ActionTypes: {
    ON_GOOGLE_TASK_EXPIRED: "ON_GOOGLE_TASK_EXPIRED",
  },
}));

describe("handleOnGoogleTaskExpiredAction", () => {
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
            type: "ON_GOOGLE_TASK_EXPIRED",
            list_name: "Sample List",
          } as OnGoogleTaskExpiredInfos,
          service_id: new ObjectId(),
          history: {
            type: "ON_GOOGLE_TASK_EXPIRED",
            taskIds: [],
          } as OnGoogleTaskExpiredHistory,
          is_webhook: false,
        },
        reaction: {
          informations: {
            type: ReactionTypes.EXAMPLE_REACTION,
            exampleField: "exampleValue",
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
      handleOnGoogleTaskExpiredAction(areaPacket, database),
    ).rejects.toThrow(
      // @ts-ignore
      `List ${areaPacket.area.action.informations.list_name} not found`,
    );
    expect(getGoogleTaskListByName).toHaveBeenCalledWith(
      "mockToken",
      "Sample List",
    );
  });

  it("should initialize history with expired tasks if taskIds is undefined", async () => {
    const expiredTask = {
      id: "task1",
      due: new Date(Date.now() - 1000).toISOString(),
    };
    (getAuthorizationToken as jest.Mock).mockResolvedValue({
      token: "mockToken",
    });
    (getGoogleTaskListByName as jest.Mock).mockResolvedValue("sampleListId");
    (getGoogleTasksByListId as jest.Mock).mockResolvedValue([expiredTask]);
    // @ts-ignore
    delete areaPacket.area.action.history.taskIds;

    const result = await handleOnGoogleTaskExpiredAction(areaPacket, database);

    expect(result).toBeNull();
    expect(database.updateAreaHistory).toHaveBeenCalledWith(
      areaPacket.user_id,
      areaPacket.area,
    );
    // @ts-ignore
    expect(areaPacket.area.action.history.taskIds).toEqual([expiredTask.id]);
  });

  it("should return null if no tasks are returned from Google", async () => {
    (getAuthorizationToken as jest.Mock).mockResolvedValue({
      token: "mockToken",
    });
    (getGoogleTaskListByName as jest.Mock).mockResolvedValue("sampleListId");
    (getGoogleTasksByListId as jest.Mock).mockResolvedValue([]);

    const result = await handleOnGoogleTaskExpiredAction(areaPacket, database);

    expect(result).toBeNull();
  });

  it("should return packet with data for expired tasks not in history", async () => {
    const mockTask = {
      id: "task2",
      title: "Expired Task",
      notes: "Task notes",
      due: new Date(Date.now() - 1000).toISOString(),
      status: "needsAction",
      updated: new Date().toISOString(),
    };
    (getAuthorizationToken as jest.Mock).mockResolvedValue({
      token: "mockToken",
    });
    (getGoogleTaskListByName as jest.Mock).mockResolvedValue("sampleListId");
    (getGoogleTasksByListId as jest.Mock).mockResolvedValue([mockTask]);
    areaPacket.area.action.history = {
      type: ActionTypes.ON_GOOGLE_TASK_EXPIRED,
      taskIds: ["task1"],
    };

    const result = await handleOnGoogleTaskExpiredAction(areaPacket, database);

    expect(result).not.toBeNull();
    expect(result?.data).toEqual({
      task_id: mockTask.id,
      title: mockTask.title,
      body: mockTask.notes,
      due_date: new Date(mockTask.due).toString(),
      due_date_string: new Date(mockTask.due).toLocaleDateString(),
      due_time_string: new Date(mockTask.due).toLocaleTimeString(),
      status: mockTask.status,
      updated_at: new Date(mockTask.updated).toString(),
      update_time: new Date(mockTask.updated).toLocaleTimeString(),
      update_date: new Date(mockTask.updated).toLocaleDateString(),
      list_name: "Sample List",
      list_id: "sampleListId",
    });
    expect(database.updateAreaHistory).toHaveBeenCalledWith(
      areaPacket.user_id,
      areaPacket.area,
    );
  });

  it("should not duplicate tasks in history when an expired task already exists", async () => {
    const mockTask = {
      id: "task2",
      title: "Expired Task",
      notes: "Task notes",
      due: new Date(Date.now() - 1000).toISOString(),
      status: "needsAction",
      updated: new Date().toISOString(),
    };
    (getAuthorizationToken as jest.Mock).mockResolvedValue({
      token: "mockToken",
    });
    (getGoogleTaskListByName as jest.Mock).mockResolvedValue("sampleListId");
    (getGoogleTasksByListId as jest.Mock).mockResolvedValue([mockTask]);
    areaPacket.area.action.history = {
      type: ActionTypes.ON_GOOGLE_TASK_EXPIRED,
      taskIds: ["task2"],
    };

    const result = await handleOnGoogleTaskExpiredAction(areaPacket, database);

    expect(result).toBeNull();
    expect(database.updateAreaHistory).toHaveBeenCalledWith(
      areaPacket.user_id,
      areaPacket.area,
    );
    expect(areaPacket.area.action.history.taskIds).toContain("task2");
  });
});
