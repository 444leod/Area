import { Module } from "@nestjs/common";
import { AreasModule } from "./areas/areas.module";
import { WebhooksModule } from "./webhooks/webhooks.module";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { ServicesModule } from "./services/services.module";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { AdminModule } from "./admin/admin.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        directConnection: true,
        uri: `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}`,
        user: process.env.MONGODB_USER,
        pass: process.env.MONGODB_PASSWORD,
        dbName: process.env.MONGODB_DB_NAME,
        authSource: process.env.MONGODB_AUTH_SOURCE,
        ssl: true,
        tlsCAFile: process.env.MONGODB_TLS_CA_FILE,
        tlsAllowInvalidCertificates: true,
      }),
    }),
    AuthModule,
    AreasModule,
    WebhooksModule,
    UsersModule,
    ServicesModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
