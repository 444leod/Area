import { ApiProperty } from "@nestjs/swagger";

export class AdminDashboardInfos {
    @ApiProperty()
    user_count: number
}
