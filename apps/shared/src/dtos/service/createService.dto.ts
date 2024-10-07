import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ type: [Object], default: [] })
  actions: any[] = [];

  @ApiProperty({ type: [Object], default: [] })
  reactions: any[] = [];
}
