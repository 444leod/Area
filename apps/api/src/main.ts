import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { NestFactory } from "@nestjs/core";
import passport from "passport";
import session from "express-session";
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      secret: process.env.SECRET_SESSION,
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  const config = new DocumentBuilder()
    .setTitle("AREA API")
    .setDescription(
      "The AREA API allows the creation of actions-reactions on multiple services."
    )
    .setVersion("0.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const options: SwaggerCustomOptions = {
    swaggerOptions: {
      defaultModelsExpandDepth: 5,
    },
  };
  SwaggerModule.setup("swagger", app, document, options);

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();

  await app.listen(8080, "0.0.0.0");
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
