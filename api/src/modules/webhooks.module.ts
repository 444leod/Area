import { Module } from "@nestjs/common";
import { AreasController } from "src/controllers/areas.controller";
import { AreasService } from "src/services/areas.service";
import { ConfigModule } from '@nestjs/config';
import { WebhookController } from "src/controllers/webhooks.controller";
import { WebhookService } from "src/services/webhooks.service";

@Module({
    imports: [ ConfigModule.forRoot({
        envFilePath: '.env',
        isGlobal: true
    })],
    controllers: [  WebhookController ],
    providers: [ WebhookService ],
})
export class WebhooksModule {};