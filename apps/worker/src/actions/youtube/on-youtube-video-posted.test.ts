import { handleYoutubeVideoPostedAction } from "./on-youtube-video-posted";
import {
  MongoDBService,
  AreaPacket,
  OnYoutubeVideoPostedInfos,
  OnYoutubeVideoPostedHistory,
  getAuthorizationToken,
  getChannelVideos,
} from "@area/shared";
import { ObjectId } from "mongodb";

jest.mock("@area/shared", () => ({
  MongoDBService: jest.fn().mockImplementation(() => ({
    updateAreaHistory: jest.fn().mockResolvedValue(undefined),
  })),
  getAuthorizationToken: jest.fn(),
  getChannelVideos: jest.fn(),
  AuthorizationsTypes: {
    GOOGLE: "GOOGLE",
  },
}));

describe("handleYoutubeVideoPostedAction", () => {
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
            type: "ON_YOUTUBE_VIDEO_POSTED",
            user_id: "channelId",
          } as OnYoutubeVideoPostedInfos,
          service_id: new ObjectId(),
          history: {
            type: "ON_YOUTUBE_VIDEO_POSTED",
            lastVideoTimestamp: 0,
          } as OnYoutubeVideoPostedHistory,
          is_webhook: false,
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
    (getChannelVideos as jest.Mock).mockResolvedValue([]);

    const result = await handleYoutubeVideoPostedAction(areaPacket, database);

    expect(result).toBeNull();
  });

  it("should return null if there are no new videos since the last timestamp", async () => {
    const videos = [
      {
        id: { videoId: "video1" },
        snippet: {
          title: "First Video",
          description: "First Description",
          publishedAt: new Date().toISOString(),
          channelTitle: "Channel 1",
          channelId: "channelId1",
          thumbnails: { high: { url: "http://example.com/high.jpg" } },
        },
      },
    ];
    (getChannelVideos as jest.Mock).mockResolvedValue(videos);

    areaPacket.area.action.history = {
      type: "ON_YOUTUBE_VIDEO_POSTED",
      lastVideoTimestamp:
        new Date(videos[0].snippet.publishedAt).getTime() + 1000,
    } as OnYoutubeVideoPostedHistory;

    const result = await handleYoutubeVideoPostedAction(areaPacket, database);

    expect(result).toBeNull();
  });

  it("should return video data for the latest new video", async () => {
    const videos = [
      {
        id: { videoId: "video1" },
        snippet: {
          title: "First Video",
          description: "First Description",
          publishedAt: new Date(Date.now() - 10000).toISOString(),
          channelTitle: "Channel 1",
          channelId: "channelId1",
          thumbnails: { high: { url: "http://example.com/high.jpg" } },
        },
      },
      {
        id: { videoId: "video2" },
        snippet: {
          title: "Second Video",
          description: "Second Description",
          publishedAt: new Date().toISOString(),
          channelTitle: "Channel 2",
          channelId: "channelId2",
          thumbnails: { high: { url: "http://example.com/high2.jpg" } },
        },
      },
    ];
    (getChannelVideos as jest.Mock).mockResolvedValue(videos);

    areaPacket.area.action.history = {
      type: "ON_YOUTUBE_VIDEO_POSTED",
      lastVideoTimestamp:
        new Date(videos[0].snippet.publishedAt).getTime() - 1000,
    } as OnYoutubeVideoPostedHistory;

    const result = await handleYoutubeVideoPostedAction(areaPacket, database);

    expect(result).not.toBeNull();
    expect(result?.data).toEqual({
      title: "Second Video",
      description: "Second Description",
      url: "https://www.youtube.com/watch?v=video2",
      published_at: new Date(videos[1].snippet.publishedAt).toDateString(),
      publication_time: new Date(
        videos[1].snippet.publishedAt,
      ).toLocaleTimeString(),
      publication_date: new Date(
        videos[1].snippet.publishedAt,
      ).toLocaleDateString(),
      channel_title: "Channel 2",
      channel_id: "channelId2",
      thumbnail_url: "http://example.com/high2.jpg",
    });
    // @ts-ignore
    expect(areaPacket.area.action.history.lastVideoTimestamp).toEqual(
      new Date(videos[1].snippet.publishedAt).getTime(),
    );
  });
});
