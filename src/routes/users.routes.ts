import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email()
});

export async function usersRoutes(app: FastifyInstance) {
  app.get("/users", async () => {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });

    return { users };
  });

  app.post("/users", async (request, reply) => {
    const body = createUserSchema.parse(request.body);

    const user = await prisma.user.create({
      data: body
    });

    return reply.code(201).send({ user });
  });
}
