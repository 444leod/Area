export type LogType = "action" | "reaction";

export type LogStatus = "success" | "exception_error" | "validation_error";

export class Log {
  type: LogType;
  date: string;
  status: LogStatus;
  message: string;
  replacedVariables?: { [key: string]: any };
}
