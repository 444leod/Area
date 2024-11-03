import { handleNewGithubRepositoryAction } from "./on-new-github-repository";
import {
  MongoDBService,
  AreaPacket,
  OnNewGithubRepositoryHistory,
  OnNewGithubRepositoryInfos,
} from "@area/shared";
import {
  getSortedUserRepositoriesSince,
  getAuthorizationToken,
} from "@area/shared";
import { ActionTypes, ReactionTypes } from "@area/shared";
import { ExampleReactionInfos } from "@area/shared";
import { ObjectId } from "mongodb";

// Mock dependencies
jest.mock("@area/shared", () => ({
  MongoDBService: jest.fn().mockImplementation(() => ({
    updateAreaHistory: jest.fn().mockResolvedValue(undefined),
  })),
  getSortedUserRepositoriesSince: jest.fn(),
  getAuthorizationToken: jest.fn(),
  AuthorizationsTypes: {
    GITHUB: "GITHUB",
  },
  ActionTypes: {
    ON_NEW_GITHUB_REPOSITORY: "ON_NEW_GITHUB_REPOSITORY",
  },
  ReactionTypes: {
    EXAMPLE_REACTION: "EXAMPLE_REACTION",
  },
}));

describe("handleNewGithubRepositoryAction", () => {
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
            type: ActionTypes.ON_NEW_GITHUB_REPOSITORY,
          } as OnNewGithubRepositoryInfos,
          service_id: new ObjectId(),
          history: {
            type: ActionTypes.ON_NEW_GITHUB_REPOSITORY,
            lastCreationTimestamp: 0,
          } as OnNewGithubRepositoryHistory,
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

  it("should initialize history if lastCreationTimestamp is null", async () => {
    (getAuthorizationToken as jest.Mock).mockResolvedValue({
      token: "mockToken",
    });
    // @ts-ignore
    areaPacket.area.action.history.lastCreationTimestamp = null;

    const result = await handleNewGithubRepositoryAction(areaPacket, database);

    expect(result).toBeNull();
    expect(database.updateAreaHistory).toHaveBeenCalledWith(
      areaPacket.user_id,
      areaPacket.area,
    );
  });

  it("should return null if no new repositories are found", async () => {
    (getAuthorizationToken as jest.Mock).mockResolvedValue({
      token: "mockToken",
    });
    (getSortedUserRepositoriesSince as jest.Mock).mockResolvedValue([]);
    areaPacket.area.action.history = {
      lastCreationTimestamp: new Date().getTime(),
    } as OnNewGithubRepositoryHistory;

    const result = await handleNewGithubRepositoryAction(areaPacket, database);

    expect(result).toBeNull();
  });

  it("should update history and return packet if new repositories are found", async () => {
    const mockRepo = {
      name: "mockRepo",
      description: "mockDescription",
      owner: { login: "mockOwner", avatar_url: "mockAvatarUrl" },
      created_at: new Date().toISOString(),
      html_url: "mockHtmlUrl",
      visibility: "public",
    };
    (getAuthorizationToken as jest.Mock).mockResolvedValue({
      token: "mockToken",
    });
    (getSortedUserRepositoriesSince as jest.Mock).mockResolvedValue([mockRepo]);
    areaPacket.area.action.history = {
      type: ActionTypes.ON_NEW_GITHUB_REPOSITORY,
      lastCreationTimestamp: new Date().getTime() - 1000000,
    } as OnNewGithubRepositoryHistory;

    const result = await handleNewGithubRepositoryAction(areaPacket, database);

    expect(getSortedUserRepositoriesSince).toHaveBeenCalledTimes(1);
    expect(result).not.toBeNull();
    expect(result?.data).toEqual({
      name: mockRepo.name,
      description: mockRepo.description,
      owner: mockRepo.owner.login,
      owner_picture_url: mockRepo.owner.avatar_url,
      created_at: new Date(mockRepo.created_at).toDateString(),
      creation_time: new Date(mockRepo.created_at).toLocaleTimeString(),
      creation_date: new Date(mockRepo.created_at).toLocaleDateString(),
      url: mockRepo.html_url,
      visibility: mockRepo.visibility,
    });
    expect(database.updateAreaHistory).toHaveBeenCalledWith(
      areaPacket.user_id,
      areaPacket.area,
    );
  });

  it("should return null if getSortedUserRepositoriesSince returns null", async () => {
    (getAuthorizationToken as jest.Mock).mockResolvedValue({
      token: "mockToken",
    });
    (getSortedUserRepositoriesSince as jest.Mock).mockResolvedValue(null);
    areaPacket.area.action.history = {
      lastCreationTimestamp: new Date().getTime(),
    } as OnNewGithubRepositoryHistory;

    const result = await handleNewGithubRepositoryAction(areaPacket, database);

    expect(result).toBeNull();
    expect(getSortedUserRepositoriesSince).toHaveBeenCalledTimes(1);
  });

  it("should fully populate packet.data when a new repository is found", async () => {
    const mockRepo = {
      name: "mockRepo",
      description: "mockDescription",
      owner: { login: "mockOwner", avatar_url: "mockAvatarUrl" },
      created_at: new Date().toISOString(),
      html_url: "mockHtmlUrl",
      visibility: "public",
    };
    (getAuthorizationToken as jest.Mock).mockResolvedValue({
      token: "mockToken",
    });
    (getSortedUserRepositoriesSince as jest.Mock).mockResolvedValue([mockRepo]);
    areaPacket.area.action.history = {
      type: ActionTypes.ON_NEW_GITHUB_REPOSITORY,
      lastCreationTimestamp: new Date().getTime() - 1000000,
    } as OnNewGithubRepositoryHistory;

    const result = await handleNewGithubRepositoryAction(areaPacket, database);

    expect(result).not.toBeNull();
    expect(result?.data).toEqual({
      name: mockRepo.name,
      description: mockRepo.description,
      owner: mockRepo.owner.login,
      owner_picture_url: mockRepo.owner.avatar_url,
      created_at: new Date(mockRepo.created_at).toDateString(),
      creation_time: new Date(mockRepo.created_at).toLocaleTimeString(),
      creation_date: new Date(mockRepo.created_at).toLocaleDateString(),
      url: mockRepo.html_url,
      visibility: mockRepo.visibility,
    });
    expect(database.updateAreaHistory).toHaveBeenCalledWith(
      areaPacket.user_id,
      areaPacket.area,
    );
  });
});
