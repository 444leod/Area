import { AppModule } from "./modules/app.module";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  const config = new DocumentBuilder()
    .setTitle("AREA API")
    .setDescription(
      "The AREA API allows the creation of actions-reactions on multiple services; as well as account manager (login, registration)."
    )
    .setVersion("0.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("swagger", app, document);

  app.enableCors();

  await app.listen(3000, "0.0.0.0");
}
bootstrap();
