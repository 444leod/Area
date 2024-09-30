import { Module } from "@nestjs/common";
import { AreasController } from "./areas.controller";
import { AreasService } from "./areas.service";
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ ConfigModule.forRoot({
        envFilePath: '.env',
        isGlobal: true
    })],
    controllers: [ AreasController ],
    providers: [ AreasService ],
})
export class AreasModule {};