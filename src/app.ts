import Fastify, { fastify, FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
  ZodTypeProvider,
} from "fastify-type-provider-zod";

import { env } from "./config/env";
import { authRoutes } from "./routes/auth.route";
import { userRoutes } from "./routes/user.route";
import { healthRoutes } from "./routes/health.route";
import { registerErrorHandler } from "./middlewares/error.middleware";
import { authPlugin } from "./middlewares/auth.middleware";
import { chatRoutes } from "./routes/chat.route";
import { meRoutes } from "./routes/me.route";
import { todoRoutes } from "./routes/todo.route";
import { classificationRoutes } from "./routes/classification.route";
import { conditionRoutes } from "./routes/condition.route";
import { consultationRoutes } from "./routes/consultation.route";
import { consultationWsRoutes } from "./routes/consultationWs.route";

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: env.APP_ENV === "production" ? "info" : "debug",
      transport:
        env.APP_ENV === "development"
          ? { target: "pino-pretty", options: { colorize: true } }
          : undefined,
    },
  }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  registerErrorHandler(app);

  await app.register(cors, {
    origin: true,
    credentials: true,
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  await app.register(jwt, {
    secret: env.JWT_SECRET,
    sign: { expiresIn: env.JWT_EXPIRES_IN },
  });

  await app.register(authPlugin);

  await app.register(swagger, {
    openapi: {
      info: {
        title: "Narabuna API",
        description: "API documentation for Narabuna",
        version: "1.0.0",
      },
      servers: [
        { url: `http://localhost:${env.PORT}` },
        { url: `ws://localhost:${env.PORT}`, description: "WebSocket" },
        { url: "https://hackfest.iccn.or.id" },
        { url: "ws://hackfest.iccn.or.id", description: "WebSocket" },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
    transform: jsonSchemaTransform,
  });

  await app.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: false,
    },
  });

  app.register(require("@fastify/websocket"), {
    options: { maxPayload: 1048576 },
  });

  app.get("/", async () => ({
    name: "Narabuna API",
    env: env.APP_ENV,
    docs: "/docs",
  }));

  await app.register(healthRoutes);
  await app.register(authRoutes, { prefix: "/auth" });
  await app.register(userRoutes, { prefix: "/users" });
  await app.register(meRoutes, { prefix: "/me" });
  await app.register(conditionRoutes, { prefix: "/conditions" });
  await app.register(todoRoutes, { prefix: "/todos" });
  await app.register(chatRoutes, { prefix: "/chat" });
  await app.register(classificationRoutes);

  await app.register(consultationRoutes, { prefix: "/consultation" });
  await app.register(consultationWsRoutes);

  return app;
}
