import { ApiProperty } from "@nestjs/swagger";

export type AreaTypesCount = {[k: string]: number}

export class AdminDashboardInfos {
    @ApiProperty()
    user_count: number;

    @ApiProperty()
    areas_count: number;

    @ApiProperty()
    active_areas_count: number;

    @ApiProperty()
    popular_actions: AreaTypesCount

    @ApiProperty()
    popular_reactions: AreaTypesCount
}
