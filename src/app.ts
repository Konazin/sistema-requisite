import Fastify from "fastify";
import { ZodError } from "zod";
import { corsPlugin } from "./plugins/cors.js";
import { jwtPlugin } from "./plugins/jwt.js";
import { healthRoutes } from "./routes/health.routes.js";
import { usersRoutes } from "./routes/users.routes.js";
import { organizationsRoutes } from "./routes/organizations.routes.js";

export async function buildApp() {
  const app = Fastify({
    logger: true
  });

  await app.register(corsPlugin);
  await app.register(jwtPlugin);

  await app.register(healthRoutes);

  await app.register(usersRoutes, {
    prefix: "/api"
  });

  await app.register(organizationsRoutes, {
    prefix: "/api"
  });

  app.setErrorHandler((error, request, reply) => {
    request.log.error(error);

    if (error instanceof ZodError) {
      return reply.status(400).send({
        error: "Validation Error",
        issues: error.issues
      });
    }

    return reply.status(500).send({
      error: "Internal Server Error",
      message:
        process.env.NODE_ENV === "production"
          ? "Unexpected error"
          : error.message
    });
  });

  return app;
}
