export type LogType = "action" | "reaction";

export type LogStatus = "success" | "exception_error" | "null_error";

export class Log {  
  type: LogType;
  date: string;
  status: LogStatus;
  message: string;
}
