export class Log {  
  type: "action" | "reaction";
  date: string;
  status: "success" | "exception_error" | "null_error";
  message: string;
}
