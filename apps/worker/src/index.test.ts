import {
  ExampleActionHistory,
  ExampleActionInfos,
  ExampleReactionInfos,
} from "@area/shared";
import dotenv from "dotenv";
import { ObjectId } from "mongodb";
import { ActionTypes, ReactionTypes } from "@area/shared";

dotenv.config();

process.env.RMQ_AREA_QUEUE = "area_queue";
process.env.RMQ_WREA_QUEUE = "wrea_queue";

const areaPacket = {
  user_id: new ObjectId(),
  area: {
    _id: new ObjectId(),
    name: "Sample Area",
    action: {
      informations: {
        type: ActionTypes.EXAMPLE_ACTION,
      } as ExampleActionInfos,
      service_id: new ObjectId(),
      history: { type: ActionTypes.EXAMPLE_ACTION } as ExampleActionHistory,
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
};

describe("getAreaFunctionsByArea", () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.resetModules();
    consoleSpy = jest.spyOn(console, "error").mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockClear();
    jest.restoreAllMocks();
  });

  it("returns null for unsupported action type", async () => {
    jest.doMock("./actions/actions-map", () => ({
      actionsMap: {},
    }));

    jest.doMock("@area/shared", () => ({
      ActionTypes: { sampleAction: "sampleAction" },
      ReactionTypes: { EXAMPLE_REACTION: "EXAMPLE_REACTION" },
    }));

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getAreaFunctionsByArea } = require("./index");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { ActionTypes } = require("@area/shared");

    const samplePacket = {
      ...areaPacket,
      area: {
        ...areaPacket.area,
        action: {
          ...areaPacket.area.action,
          informations: { type: ActionTypes.sampleAction },
        },
      },
    };

    const res = getAreaFunctionsByArea(samplePacket.area);

    expect(res).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(
      "Action sampleAction not supported.",
    );
  });

  it("returns null for unsupported reaction type", async () => {
    jest.doMock("./actions/actions-map", () => ({
      actionsMap: { sampleAction: jest.fn() },
    }));

    jest.doMock("./reactions/reactions-map", () => ({
      reactionsMap: {},
    }));

    jest.doMock("@area/shared", () => ({
      ActionTypes: { sampleAction: "sampleAction" },
      ReactionTypes: { sampleReaction: "sampleReaction" },
    }));

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getAreaFunctionsByArea } = require("./index");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { ActionTypes, ReactionTypes } = require("@area/shared");

    const samplePacket = {
      ...areaPacket,
      area: {
        ...areaPacket.area,
        action: {
          ...areaPacket.area.action,
          informations: { type: ActionTypes.sampleAction },
        },
        reaction: {
          ...areaPacket.area.reaction,
          informations: { type: ReactionTypes.sampleReaction },
        },
      },
    };

    const res = getAreaFunctionsByArea(samplePacket.area);

    expect(res).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(
      "Reaction sampleReaction not supported.",
    );
  });

  it("returns correct functions", async () => {
    jest.doMock("./actions/actions-map", () => ({
      actionsMap: { sampleAction: jest.fn() },
    }));

    jest.doMock("./reactions/reactions-map", () => ({
      reactionsMap: { sampleReaction: jest.fn() },
    }));

    jest.doMock("@area/shared", () => ({
      ActionTypes: { sampleAction: "sampleAction" },
      ReactionTypes: { sampleReaction: "sampleReaction" },
    }));

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getAreaFunctionsByArea } = require("./index");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { ActionTypes, ReactionTypes } = require("@area/shared");

    const samplePacket = {
      ...areaPacket,
      area: {
        ...areaPacket.area,
        action: {
          ...areaPacket.area.action,
          informations: { type: ActionTypes.sampleAction },
        },
        reaction: {
          ...areaPacket.area.reaction,
          informations: { type: ReactionTypes.sampleReaction },
        },
      },
    };

    const res = getAreaFunctionsByArea(samplePacket.area);

    expect(res).toEqual({
      actionFunction: expect.any(Function),
      reactionFunction: expect.any(Function),
    });
  });

  it("returns null when action type is missing", async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getAreaFunctionsByArea } = require("./index");

    const samplePacket = {
      ...areaPacket,
      area: {
        ...areaPacket.area,
        action: {
          ...areaPacket.area.action,
          informations: {}, // No type provided
        },
        reaction: {
          ...areaPacket.area.reaction,
          informations: { type: "sampleReaction" },
        },
      },
    };

    const res = getAreaFunctionsByArea(samplePacket.area);

    expect(res).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(
      "Action or reaction type not found.",
    );
  });
});

import { MongoDBService, RabbitMQService } from "@area/shared";
import { run } from "./index"; //

// Mock the entire modules
jest.mock("@area/shared");
jest.mock("dotenv");

describe("run function", () => {
  let mockMongoDB: jest.Mocked<MongoDBService>;
  let mockRabbitMQ: jest.Mocked<RabbitMQService>;
  let isRunning: boolean;

  const mockConsoleLog = jest.spyOn(console, "log");
  const mockConsoleError = jest.spyOn(console, "error");

  beforeEach(() => {
    jest.clearAllMocks();

    mockMongoDB = {
      connect: jest.fn().mockResolvedValue(undefined),
      listCollections: jest.fn().mockResolvedValue([]),
      createCollection: jest.fn().mockResolvedValue(undefined),
      close: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<MongoDBService>;

    mockRabbitMQ = {
      connect: jest.fn().mockResolvedValue(undefined),
      queueStats: jest.fn().mockResolvedValue({ messageCount: 0 }),
      consumePacket: jest.fn().mockResolvedValue(undefined),
      close: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<RabbitMQService>;

    isRunning = true;

    process.env.RMQ_AREA_QUEUE = "area_queue";
    process.env.RMQ_WREA_QUEUE = "wrea_queue";
  });

  afterEach(() => {
    jest.resetAllMocks();
    mockConsoleError.mockClear();
    mockConsoleLog.mockClear();
  });

  it("should create users collection if no collections exist", async () => {
    isRunning = false;
    mockMongoDB.listCollections.mockResolvedValueOnce([]);

    mockConsoleLog.mockImplementationOnce(() => {}); // Ignore console.log

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { run } = require("./index");
    await run(mockMongoDB, mockRabbitMQ, isRunning);

    expect(mockMongoDB.createCollection).toHaveBeenCalledWith("users");
  });

  it("should not create users collection if collections exist", async () => {
    isRunning = false;
    mockMongoDB.listCollections.mockResolvedValueOnce(["existing_collection"]);

    mockConsoleLog.mockImplementationOnce(() => {}); // Ignore console.log

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { run } = require("./index");
    await run(mockMongoDB, mockRabbitMQ, isRunning);

    expect(mockMongoDB.createCollection).not.toHaveBeenCalled();
  });

  it("should select area queue when it has more messages", async () => {
    isRunning = false;
    mockRabbitMQ.queueStats
      // @ts-ignore
      .mockResolvedValueOnce({ messageCount: 10 }) // area queue
      // @ts-ignore
      .mockResolvedValueOnce({ messageCount: 5 }); // wrea queue

    mockConsoleLog.mockImplementationOnce(() => {}); // Ignore console.log
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { run } = require("./index");

    await run(mockMongoDB, mockRabbitMQ, isRunning);

    expect(mockRabbitMQ.consumePacket).toHaveBeenCalledWith(
      "area_queue",
      expect.any(Function),
      mockMongoDB,
    );
  });

  it("should select wrea queue when it has more messages", async () => {
    isRunning = false;
    mockRabbitMQ.queueStats
      // @ts-ignore
      .mockResolvedValueOnce({ messageCount: 5 })
      // @ts-ignore
      .mockResolvedValueOnce({ messageCount: 10 });

    mockConsoleLog.mockImplementationOnce(() => {});
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { run } = require("./index");
    await run(mockMongoDB, mockRabbitMQ, isRunning);

    expect(mockRabbitMQ.consumePacket).toHaveBeenCalledWith(
      "wrea_queue",
      expect.any(Function),
      mockMongoDB,
    );
  });

  it("should close connections when SIGINT is received", async () => {
    const delay = new Promise((resolve) => setTimeout(resolve, 100));

    mockConsoleLog.mockImplementationOnce(() => {});
    const runPromise = run(mockMongoDB, mockRabbitMQ, true);

    await delay;

    process.emit("SIGINT");

    await runPromise;

    expect(mockRabbitMQ.close).toHaveBeenCalled();
    expect(mockMongoDB.close).toHaveBeenCalled();
  });

  it("should close connections when SIGTERM is received", async () => {
    const delay = new Promise((resolve) => setTimeout(resolve, 100));

    mockConsoleLog.mockImplementationOnce(() => {});
    const runPromise = run(mockMongoDB, mockRabbitMQ, true);

    await delay;

    process.emit("SIGTERM");

    await runPromise;

    expect(mockRabbitMQ.close).toHaveBeenCalled();
    expect(mockMongoDB.close).toHaveBeenCalled();
  });
});

import { AreaPacket, ReactionInfos, replaceField } from "@area/shared";
import { updateReactionFields } from "./index";

describe("updateReactionFields", () => {
  const mockDate = new Date("2024-01-01T12:00:00Z");

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(global, "Date").mockImplementation(() => mockDate as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should update area packet data with date-related fields", () => {
    const areaPacket: Partial<AreaPacket> = {
      area: {
        name: "Test Area",
      } as any,
      data: {},
    };

    const reactionInfos: ReactionInfos = {
      type: ReactionTypes.SEND_EMAIL,
      to: "test@example.com",
      subject: "Test Subject",
      body: "Test Body",
    };

    updateReactionFields(areaPacket as AreaPacket, reactionInfos);

    expect(areaPacket.data).toEqual({
      area_name: "Test Area",
      full_execution_date: mockDate.toString(),
      execution_date: mockDate.toLocaleDateString(),
      execution_time: mockDate.toLocaleTimeString(),
    });
  });

  it("should replace fields in reactionInfos using replaceField", () => {
    const areaPacket: Partial<AreaPacket> = {
      area: {
        name: "Test Area",
      } as any,
      data: {
        testValue: "replaced value",
        test123: "replaced 123",
      },
    };

    const reactionInfos: ReactionInfos = {
      type: ReactionTypes.SEND_EMAIL,
      to: "user@{{testValue}}",
      subject: "Subject with {{testValue}}",
      body: "Email body with {{test123}}",
    };

    updateReactionFields(areaPacket as AreaPacket, reactionInfos);

    expect(replaceField).toHaveBeenCalledTimes(3);
    expect(replaceField).toHaveBeenCalledWith(
      "user@{{testValue}}",
      areaPacket.data,
    );
    expect(replaceField).toHaveBeenCalledWith(
      "Subject with {{testValue}}",
      areaPacket.data,
    );
    expect(replaceField).toHaveBeenCalledWith(
      "Email body with {{test123}}",
      areaPacket.data,
    );
  });

  it("should skip type field in reactionInfos", () => {
    const areaPacket: Partial<AreaPacket> = {
      area: {
        name: "Test Area",
      } as any,
      data: {},
    };

    const reactionInfos: ReactionInfos = {
      type: ReactionTypes.SEND_EMAIL,
      to: "test@example.com",
      subject: "Test Subject",
      body: "Test Body",
    };

    updateReactionFields(areaPacket as AreaPacket, reactionInfos);

    expect(reactionInfos.type).toBe(ReactionTypes.SEND_EMAIL);
    expect(replaceField).not.toHaveBeenCalledWith(
      ReactionTypes.SEND_EMAIL,
      expect.any(Object),
    );
  });

  it("should skip non-string fields if somehow present", () => {
    const areaPacket: Partial<AreaPacket> = {
      area: {
        name: "Test Area",
      } as any,
      data: {},
    };

    const reactionInfos = {
      type: ReactionTypes.SEND_EMAIL,
      to: "test@example.com",
      subject: "Test Subject",
      body: "Test Body",
      extraField: 123,
    } as any;

    updateReactionFields(areaPacket as AreaPacket, reactionInfos);

    expect(replaceField).toHaveBeenCalledTimes(3);
    expect(replaceField).toHaveBeenCalledWith(
      "test@example.com",
      areaPacket.data,
    );
    expect(replaceField).toHaveBeenCalledWith("Test Subject", areaPacket.data);
    expect(replaceField).toHaveBeenCalledWith("Test Body", areaPacket.data);
    expect(reactionInfos.extraField).toBe(123);
  });

  it("should skip empty string fields in reactionInfos", () => {
    const areaPacket: Partial<AreaPacket> = {
      area: {
        name: "Test Area",
      } as any,
      data: {},
    };

    const reactionInfos: ReactionInfos = {
      type: ReactionTypes.SEND_EMAIL,
      to: "test@example.com",
      subject: "", // Empty subject
      body: "Test Body",
    };

    updateReactionFields(areaPacket as AreaPacket, reactionInfos);

    expect(replaceField).toHaveBeenCalledTimes(2);
    expect(replaceField).toHaveBeenCalledWith(
      "test@example.com",
      areaPacket.data,
    );
    expect(replaceField).toHaveBeenCalledWith("Test Body", areaPacket.data);
  });

  it("should handle undefined fields in reactionInfos", () => {
    const areaPacket: Partial<AreaPacket> = {
      area: {
        name: "Test Area",
      } as any,
      data: {},
    };

    const reactionInfos: ReactionInfos = {
      type: ReactionTypes.SEND_EMAIL,
      to: "test@example.com",
      subject: "Test Subject",
      body: undefined as any,
    };

    updateReactionFields(areaPacket as AreaPacket, reactionInfos);

    expect(replaceField).toHaveBeenCalledTimes(2);
    expect(replaceField).toHaveBeenCalledWith(
      "test@example.com",
      areaPacket.data,
    );
    expect(replaceField).toHaveBeenCalledWith("Test Subject", areaPacket.data);
  });
});

import { AxiosError } from "axios";

jest.mock("./log", () => ({
  handleExceptionError: jest.fn(),
  handleValidationError: jest.fn(),
  addLogToAreaWrapper: jest.fn(),
}));

describe("handleArea", () => {
  let mongoDB: MongoDBService;
  let areaPacket: AreaPacket;

  beforeEach(() => {
    mongoDB = new MongoDBService();
    areaPacket = {
      area: {
        action: {
          informations: {
            type: "actionType",
          },
        },
        reaction: {
          informations: {
            type: "reactionType",
          },
        },
        _id: "areaId",
      },
      data: {},
    } as unknown as AreaPacket;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should handle area successfully", async () => {
    const actionFunction = jest.fn().mockResolvedValue(areaPacket);
    const reactionFunction = jest.fn().mockResolvedValue(undefined);

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { actionsMap } = require("./actions/actions-map");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { reactionsMap } = require("./reactions/reactions-map");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { addLogToAreaWrapper } = require("./log");

    actionsMap.actionType = actionFunction;
    reactionsMap.reactionType = reactionFunction;

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { handleArea } = require("./index");

    await handleArea(areaPacket, mongoDB);

    expect(actionFunction).toHaveBeenCalledWith(areaPacket, mongoDB);
    expect(reactionFunction).toHaveBeenCalledWith(areaPacket, mongoDB);
    expect(addLogToAreaWrapper).toHaveBeenCalledTimes(2);
  });

  it("should handle action function failure", async () => {
    const actionFunction = jest
      .fn()
      .mockRejectedValue(new AxiosError("Action error"));
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { actionsMap } = require("./actions/actions-map");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { reactionsMap } = require("./reactions/reactions-map");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { handleArea } = require("./index");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { handleExceptionError } = require("./log");
    actionsMap.actionType = actionFunction;

    await handleArea(areaPacket, mongoDB);

    expect(actionFunction).toHaveBeenCalledWith(areaPacket, mongoDB);
    expect(handleExceptionError).toHaveBeenCalledWith(
      areaPacket,
      mongoDB,
      expect.any(AxiosError),
      "action",
    );
    expect(reactionsMap.reactionType).not.toHaveBeenCalled();
  });
});
