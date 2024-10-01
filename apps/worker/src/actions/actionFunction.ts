import { MongoDBService, AreaDTO } from '@area/shared';

export type ActionFunction = (area: AreaDTO, database: MongoDBService) => Promise<AreaDTO> | undefined;
