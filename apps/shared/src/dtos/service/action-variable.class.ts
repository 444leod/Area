import { ApiProperty } from "@nestjs/swagger";

export class ActionVariable {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  type: "string" | "number" | "date" | "text" | "boolean";

  @ApiProperty()
  template: string;
}
