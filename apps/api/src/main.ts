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

  // CORS doit être configuré en premier
  app.enableCors({
    origin: [
      "http://34.140.49.18", // API
      "http://34.79.27.38", // Frontend
      "http://localhost:8081",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: false,
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    exposedHeaders: ["Authorization"],
  });

  app.use(
    session({
      secret: process.env.SECRET_SESSION,
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  const config = new DocumentBuilder()
    .setTitle("AREA API")
    .setDescription(
      "The AREA API allows the creation of actions-reactions on multiple services.",
    )
    .addBearerAuth({
      type: "http",
      description: "The Bearer token given to a User",
      name: "Bearer",
    })
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

  await app.listen(8080, "0.0.0.0");
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
