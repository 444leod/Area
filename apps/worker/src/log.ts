import { AreaPacket, LogType, LogStatus, MongoDBService } from "@area/shared";
import { AxiosError, isAxiosError } from "axios";

/**
 * Add a log to the area
 *
 * @param areaPacket
 * @param database
 * @param type
 * @param errorMessage
 * @param status
 * @param replacedVariables
 */
export async function addLogToAreaWrapper(
  areaPacket: AreaPacket,
  database: MongoDBService,
  type: LogType,
  errorMessage: string,
  status: LogStatus,
  replacedVariables?: { [key: string]: any },
) {
  return database.addLogToArea(areaPacket.user_id, areaPacket.area._id, {
    type: type,
    date: new Date().toISOString(),
    status: status,
    message: errorMessage,
    replacedVariables: replacedVariables,
  });
}

/**
 * Handle the validation error
 * Log the error message
 *
 * @param areaPacket
 * @param database
 * @param type
 * @param errorMessage
 */
export async function handleValidationError(
  areaPacket: AreaPacket,
  database: MongoDBService,
  type: LogType,
  errorMessage: string,
) {
  console.error(errorMessage);
  await addLogToAreaWrapper(
    areaPacket,
    database,
    type,
    errorMessage,
    "validation_error",
  );
}

/**
 * Handle the exception error
 * Log the error message
 *
 * @param areaPacket
 * @param database
 * @param error
 * @param type
 */
export async function handleExceptionError(
  areaPacket: AreaPacket,
  database: MongoDBService,
  error: AxiosError | any,
  type: LogType,
) {
  const errorMessage = JSON.stringify(
    isAxiosError(error)
      ? error.response
        ? {
            message: error.message,
            url: error.config?.url,
            status: error.response.status,
            statusText: error.response.statusText,
          }
        : {
            message: error.message,
            description: "Request was made but no response received.",
          }
      : { message: error.message },
  );
  console.error(errorMessage);
  await addLogToAreaWrapper(
    areaPacket,
    database,
    type,
    errorMessage,
    "exception_error",
  );
}
