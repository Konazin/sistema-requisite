import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";

const createOrganizationSchema = z.object({
  name: z.string().min(2),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Use apenas letras minúsculas, números e hífen")
});

export async function organizationsRoutes(app: FastifyInstance) {
  app.get("/organizations", async () => {
    const organizations = await prisma.organization.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });

    return { organizations };
  });

  app.post("/organizations", async (request, reply) => {
    const body = createOrganizationSchema.parse(request.body);

    const organization = await prisma.organization.create({
      data: body
    });

    return reply.code(201).send({ organization });
  });
}
