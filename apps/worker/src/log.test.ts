import { AreaPacket, LogType, LogStatus, MongoDBService } from "@area/shared";
import { AxiosError } from "axios";
import {
  addLogToAreaWrapper,
  handleValidationError,
  handleExceptionError,
} from "./log";
import { ObjectId } from "mongodb";
import { ActionTypes, ReactionTypes } from "@area/shared";
import {
  ExampleActionInfos,
  ExampleActionHistory,
  ExampleReactionInfos,
} from "@area/shared";
import dotenv from "dotenv";

dotenv.config();

process.env.RMQ_AREA_QUEUE = "area_queue";
process.env.RMQ_WREA_QUEUE = "wrea_queue";

// Mock dependencies
jest.mock("@area/shared", () => ({
  MongoDBService: jest.fn().mockImplementation(() => ({
    addLogToArea: jest.fn().mockResolvedValue(undefined),
  })),
  ActionTypes: {
    EXAMPLE_ACTION: "EXAMPLE_ACTION",
  },
  ReactionTypes: {
    EXAMPLE_REACTION: "EXAMPLE_REACTION",
  },
}));

describe("log.ts", () => {
  let database: MongoDBService;
  let areaPacket: AreaPacket;

  beforeEach(() => {
    jest.resetModules();
    database = new MongoDBService();
    areaPacket = {
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
    } as AreaPacket;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("addLogToAreaWrapper", () => {
    it("should add a log to the area", async () => {
      const logType: LogType = "action";
      const errorMessage = "Error message";
      const logStatus: LogStatus = "success";
      const replacedVariables = { key: "value" };

      await addLogToAreaWrapper(
        areaPacket,
        database,
        logType,
        errorMessage,
        logStatus,
        replacedVariables,
      );

      expect(database.addLogToArea).toHaveBeenCalledWith(
        areaPacket.user_id,
        areaPacket.area._id,
        {
          type: logType,
          date: expect.any(String),
          status: logStatus,
          message: errorMessage,
          replacedVariables: replacedVariables,
        },
      );
    });
  });

  describe("handleValidationError", () => {
    it("should handle validation error and log the error message", async () => {
      const logType: LogType = "action";
      const errorMessage = "Validation error message";
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      await handleValidationError(areaPacket, database, logType, errorMessage);

      expect(consoleSpy).toHaveBeenCalledWith(errorMessage);
      expect(database.addLogToArea).toHaveBeenCalledWith(
        areaPacket.user_id,
        areaPacket.area._id,
        {
          type: logType,
          date: expect.any(String),
          status: "validation_error",
          message: errorMessage,
          replacedVariables: undefined,
        },
      );

      consoleSpy.mockRestore();
    });
  });

  describe("handleExceptionError", () => {
    it("should handle exception error and log the error message", async () => {
      const logType: LogType = "action";
      const error = new Error("Exception error message");
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      await handleExceptionError(areaPacket, database, error, logType);

      const errorMessage = JSON.stringify({ message: error.message });

      expect(consoleSpy).toHaveBeenCalledWith(errorMessage);
      expect(database.addLogToArea).toHaveBeenCalledWith(
        areaPacket.user_id,
        areaPacket.area._id,
        {
          type: logType,
          date: expect.any(String),
          status: "exception_error",
          message: errorMessage,
          replacedVariables: undefined,
        },
      );

      consoleSpy.mockRestore();
    });

    it("should handle AxiosError with response and log the error message", async () => {
      const logType: LogType = "action";
      const error = {
        isAxiosError: true,
        message: "Axios error message",
        config: { url: "http://example.com" },
        response: {
          status: 404,
          statusText: "Not Found",
        },
      } as AxiosError;
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      await handleExceptionError(areaPacket, database, error, logType);

      const errorMessage = JSON.stringify({
        message: error.message,
        url: error.config?.url,
        status: error.response?.status,
        statusText: error.response?.statusText,
      });

      expect(consoleSpy).toHaveBeenCalledWith(errorMessage);
      expect(database.addLogToArea).toHaveBeenCalledWith(
        areaPacket.user_id,
        areaPacket.area._id,
        {
          type: logType,
          date: expect.any(String),
          status: "exception_error",
          message: errorMessage,
          replacedVariables: undefined,
        },
      );

      consoleSpy.mockRestore();
    });

    it("should handle AxiosError without response and log the error message", async () => {
      const logType: LogType = "action";
      const error = {
        isAxiosError: true,
        message: "Axios error message",
        config: { url: "http://example.com" },
      } as AxiosError;
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      await handleExceptionError(areaPacket, database, error, logType);

      const errorMessage = JSON.stringify({
        message: error.message,
        description: "Request was made but no response received.",
      });

      expect(consoleSpy).toHaveBeenCalledWith(errorMessage);
      expect(database.addLogToArea).toHaveBeenCalledWith(
        areaPacket.user_id,
        areaPacket.area._id,
        {
          type: logType,
          date: expect.any(String),
          status: "exception_error",
          message: errorMessage,
          replacedVariables: undefined,
        },
      );

      consoleSpy.mockRestore();
    });
  });
});
