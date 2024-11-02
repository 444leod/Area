import { handleOnNewYoutubeVideoInPlaylistAction } from "./on-video-in-playlist";
import {
  MongoDBService,
  AreaPacket,
  OnNewVideoInPlaylistInfos,
  OnNewVideoInPlaylistHistory,
  getAuthorizationToken,
  getPlaylistVideos,
} from "@area/shared";
import { ObjectId } from "mongodb";

// Mock external dependencies
jest.mock("@area/shared", () => ({
  getAuthorizationToken: jest.fn(),
  getPlaylistVideos: jest.fn(),
  AuthorizationsTypes: {
    GOOGLE: "GOOGLE",
  },
}));

describe("handleOnNewYoutubeVideoInPlaylistAction", () => {
  let database: MongoDBService;
  let areaPacket: AreaPacket;

  beforeEach(() => {
    database = {
      updateAreaHistory: jest.fn().mockResolvedValue(undefined),
    } as unknown as MongoDBService;

    areaPacket = {
      user_id: new ObjectId(),
      area: {
        _id: new ObjectId(),
        name: "Sample Area",
        action: {
          informations: {
            type: "ON_NEW_VIDEO_IN_PLAYLIST",
            playlist_id: "playlistId",
          } as OnNewVideoInPlaylistInfos,
          history: {
            type: "ON_NEW_VIDEO_IN_PLAYLIST",
            videoIds: [],
          } as OnNewVideoInPlaylistHistory,
          is_webhook: false,
          service_id: new ObjectId(),
        },
        reaction: {
          informations: {
            type: "EXAMPLE_REACTION",
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

    (getAuthorizationToken as jest.Mock).mockResolvedValue({
      token: "mockToken",
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return null if no videos are found", async () => {
    (getPlaylistVideos as jest.Mock).mockResolvedValue([]);

    const result = await handleOnNewYoutubeVideoInPlaylistAction(
      areaPacket,
      database,
    );

    expect(result).toBeNull();
  });

  it("should initialize history.videoIds if it is empty", async () => {
    const videos = [
      {
        snippet: {
          resourceId: { videoId: "video1" },
          title: "First Video",
          description: "Description 1",
          publishedAt: new Date().toISOString(),
          channelTitle: "Channel 1",
          channelId: "channelId1",
          thumbnails: { high: { url: "http://example.com/high.jpg" } },
        },
      },
    ];
    (getPlaylistVideos as jest.Mock).mockResolvedValue(videos);

    const result = await handleOnNewYoutubeVideoInPlaylistAction(
      areaPacket,
      database,
    );

    expect(result).not.toBeNull();
    // @ts-ignore
    expect(areaPacket.area.action.history.videoIds).toEqual(["video1"]);
    expect(result?.data.video_id).toEqual("video1");
  });

  it("should return null if no new videos are found since last check", async () => {
    areaPacket.area.action.history = {
      type: "ON_NEW_VIDEO_IN_PLAYLIST",
      videoIds: ["video1"],
    } as OnNewVideoInPlaylistHistory;

    const videos = [
      {
        snippet: {
          resourceId: { videoId: "video1" },
          title: "First Video",
          description: "Description 1",
          publishedAt: new Date().toISOString(),
          channelTitle: "Channel 1",
          channelId: "channelId1",
          thumbnails: { high: { url: "http://example.com/high.jpg" } },
        },
      },
    ];
    (getPlaylistVideos as jest.Mock).mockResolvedValue(videos);

    const result = await handleOnNewYoutubeVideoInPlaylistAction(
      areaPacket,
      database,
    );

    expect(result).toBeNull();
  });

  it("should call database.updateAreaHistory if history is updated", async () => {
    const videos = [
      {
        snippet: {
          resourceId: { videoId: "video2" },
          title: "Second Video",
          description: "Description 2",
          publishedAt: new Date().toISOString(),
          channelTitle: "Channel 2",
          channelId: "channelId2",
          thumbnails: { high: { url: "http://example.com/high2.jpg" } },
        },
      },
    ];
    (getPlaylistVideos as jest.Mock).mockResolvedValue(videos);

    const result = await handleOnNewYoutubeVideoInPlaylistAction(
      areaPacket,
      database,
    );

    expect(database.updateAreaHistory).toHaveBeenCalledWith(
      areaPacket.user_id,
      areaPacket.area,
    );
  });
});
