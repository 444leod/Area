import { handleOnPullRequestStateAction } from "./on-pull-request-state";
import {
  MongoDBService,
  AreaPacket,
  OnPullRequestStateHistory,
  OnPullRequestStateInfos,
  ExampleReactionInfos,
} from "@area/shared";
import { getRepositoryPullRequests, getAuthorizationToken } from "@area/shared";
import { ActionTypes, ReactionTypes } from "@area/shared";
import { ObjectId } from "mongodb";

jest.mock("@area/shared", () => ({
  MongoDBService: jest.fn().mockImplementation(() => ({
    updateAreaHistory: jest.fn().mockResolvedValue(undefined),
  })),
  getRepositoryPullRequests: jest.fn(),
  getAuthorizationToken: jest.fn(),
  AuthorizationsTypes: {
    GITHUB: "GITHUB",
  },
  ActionTypes: {
    ON_PULL_REQUEST_STATE: "ON_PULL_REQUEST_STATE",
  },
  ReactionTypes: {
    EXAMPLE_REACTION: "EXAMPLE_REACTION",
  },
}));

describe("handleOnPullRequestStateAction", () => {
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
            type: ActionTypes.ON_PULL_REQUEST_STATE,
            owner: "mockOwner",
            repository: "mockRepo",
            state: "open",
          } as OnPullRequestStateInfos,
          service_id: new ObjectId(),
          history: {
            lastUpdateTimestamp: 0,
          } as OnPullRequestStateHistory,
          is_webhook: false,
        },
        reaction: {
          informations: {
            type: ReactionTypes.EXAMPLE_REACTION,
          } as ExampleReactionInfos,
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

  it("should initialize history if lastUpdateTimestamp is null", async () => {
    (getAuthorizationToken as jest.Mock).mockResolvedValue({
      token: "mockToken",
    });
    // @ts-ignore
    areaPacket.area.action.history.lastUpdateTimestamp = null;

    const result = await handleOnPullRequestStateAction(areaPacket, database);

    expect(result).toBeNull();
    expect(database.updateAreaHistory).toHaveBeenCalledWith(
      areaPacket.user_id,
      areaPacket.area,
    );
  });

  it("should return null if no pull requests are found", async () => {
    (getAuthorizationToken as jest.Mock).mockResolvedValue({
      token: "mockToken",
    });
    (getRepositoryPullRequests as jest.Mock).mockResolvedValue([]);
    areaPacket.area.action.history = {
      lastUpdateTimestamp: new Date().getTime(),
    } as OnPullRequestStateHistory;

    const result = await handleOnPullRequestStateAction(areaPacket, database);

    expect(result).toBeNull();
  });

  it("should update history and return packet if pull requests are found", async () => {
    const mockPR = {
      title: "Mock PR",
      body: "Mock description",
      html_url: "mockHtmlUrl",
      state: "open",
      number: 1,
      user: { login: "mockUser", avatar_url: "mockAvatarUrl" },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      merged_at: null,
    };
    (getAuthorizationToken as jest.Mock).mockResolvedValue({
      token: "mockToken",
    });
    (getRepositoryPullRequests as jest.Mock).mockResolvedValue([mockPR]);
    areaPacket.area.action.history = {
      lastUpdateTimestamp: new Date().getTime() - 1000000,
    } as OnPullRequestStateHistory;

    const result = await handleOnPullRequestStateAction(areaPacket, database);

    expect(getRepositoryPullRequests).toHaveBeenCalledTimes(1);
    expect(result).not.toBeNull();
    expect(result?.data).toEqual({
      title: mockPR.title,
      description: mockPR.body,
      url: mockPR.html_url,
      state: mockPR.state,
      number: String(mockPR.number),
      creator: mockPR.user.login,
      creator_picture_url: mockPR.user.avatar_url,
      created_at: new Date(mockPR.created_at).toDateString(),
      creation_time: new Date(mockPR.created_at).toLocaleTimeString(),
      creation_date: new Date(mockPR.created_at).toLocaleDateString(),
      updated_at: new Date(mockPR.updated_at).toDateString(),
      merged_at: "",
    });
    expect(database.updateAreaHistory).toHaveBeenCalledWith(
      areaPacket.user_id,
      areaPacket.area,
    );
  });

  it("should return null if no pull requests meet the timestamp criteria", async () => {
    (getAuthorizationToken as jest.Mock).mockResolvedValue({
      token: "mockToken",
    });
    (getRepositoryPullRequests as jest.Mock).mockResolvedValue(null);
    areaPacket.area.action.history = {
      lastUpdateTimestamp: new Date().getTime(),
    } as OnPullRequestStateHistory;

    const result = await handleOnPullRequestStateAction(areaPacket, database);

    expect(result).toBeNull();
    expect(database.updateAreaHistory).not.toHaveBeenCalled();
    expect(getRepositoryPullRequests).toHaveBeenCalledWith({
      token: "mockToken",
      owner: "mockOwner",
      repo: "mockRepo",
      since: new Date(areaPacket.area.action.history.lastUpdateTimestamp),
      state: "open",
      sort: "updated_at",
      direction: "desc",
    });
  });

  it("should update packet data when a valid pull request is found", async () => {
    const mockPR = {
      title: "Mock PR",
      body: "Mock description",
      html_url: "mockHtmlUrl",
      state: "open",
      number: 1,
      user: { login: "mockUser", avatar_url: "mockAvatarUrl" },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      merged_at: new Date().toISOString(),
    };
    (getAuthorizationToken as jest.Mock).mockResolvedValue({
      token: "mockToken",
    });
    (getRepositoryPullRequests as jest.Mock).mockResolvedValue([mockPR]);
    areaPacket.area.action.history = {
      lastUpdateTimestamp: new Date().getTime() - 1000000,
    } as OnPullRequestStateHistory;

    const result = await handleOnPullRequestStateAction(areaPacket, database);

    expect(result).not.toBeNull();
    expect(result?.data).toEqual({
      title: mockPR.title,
      description: mockPR.body,
      url: mockPR.html_url,
      state: mockPR.state,
      number: String(mockPR.number),
      creator: mockPR.user.login,
      creator_picture_url: mockPR.user.avatar_url,
      created_at: new Date(mockPR.created_at).toDateString(),
      creation_time: new Date(mockPR.created_at).toLocaleTimeString(),
      creation_date: new Date(mockPR.created_at).toLocaleDateString(),
      updated_at: new Date(mockPR.updated_at).toDateString(),
      merged_at: new Date(mockPR.merged_at).toDateString(),
    });
    expect(database.updateAreaHistory).toHaveBeenCalledWith(
      areaPacket.user_id,
      areaPacket.area,
    );
  });
});
