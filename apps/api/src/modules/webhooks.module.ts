import { Module } from "@nestjs/common";
import { ConfigModule } from '@nestjs/config';
import { WebhookController } from "../controllers/webhooks.controller";
import { WebhookService } from "../services/webhooks.service";

@Module({
    imports: [ ConfigModule.forRoot({
        envFilePath: '.env',
        isGlobal: true
    })],
    controllers: [  WebhookController ],
    providers: [ WebhookService ],
})
export class WebhooksModule {};