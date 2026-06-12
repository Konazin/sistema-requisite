#!/usr/bin/env bash
set -euo pipefail

PROJECT_NAME="$(basename "$PWD")"
STAMP="$(date +%Y%m%d%H%M%S)"

echo "Configurando projeto no diretório atual: $PROJECT_NAME"

backup_if_exists() {
  local file="$1"

  if [ -f "$file" ]; then
    cp "$file" "$file.bak.$STAMP"
    echo "Backup criado: $file.bak.$STAMP"
  fi
}

write_file() {
  local file="$1"
  mkdir -p "$(dirname "$file")"

  if [ -f "$file" ]; then
    cp "$file" "$file.bak.$STAMP"
    echo "Backup criado: $file.bak.$STAMP"
  fi

  cat > "$file"
}

if [ ! -f package.json ]; then
  npm init -y
fi

npm pkg set "name=$PROJECT_NAME"
npm pkg set "version=0.1.0"
npm pkg set "type=module"
npm pkg set "private=true"

npm pkg set "scripts.dev=npm run prisma:dev && dotenv -e .env.development -- tsx watch src/server.ts"
npm pkg set "scripts.build=npm run prisma:prod && tsc"
npm pkg set "scripts.start=dotenv -e .env.production -- node dist/server.js"
npm pkg set "scripts.prisma:dev=node scripts/write-prisma-schema.mjs dev && dotenv -e .env.development -- prisma generate"
npm pkg set "scripts.prisma:prod=node scripts/write-prisma-schema.mjs prod && dotenv -e .env.production -- prisma generate"
npm pkg set "scripts.db:dev=node scripts/write-prisma-schema.mjs dev && dotenv -e .env.development -- prisma db push"
npm pkg set "scripts.db:prod:migrate=node scripts/write-prisma-schema.mjs prod && dotenv -e .env.production -- prisma migrate deploy"
npm pkg set "scripts.db:prod:create-migration=node scripts/write-prisma-schema.mjs prod && dotenv -e .env.production -- prisma migrate dev"
npm pkg set "scripts.studio:dev=node scripts/write-prisma-schema.mjs dev && dotenv -e .env.development -- prisma studio"
npm pkg set "scripts.studio:prod=node scripts/write-prisma-schema.mjs prod && dotenv -e .env.production -- prisma studio"

mkdir -p src/{lib,routes,plugins}
mkdir -p prisma scripts

write_file tsconfig.json <<'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
EOF

if [ ! -f .env.development ]; then
  cat > .env.development <<'EOF'
NODE_ENV=development
PORT=3333
JWT_SECRET=dev_secret_change_me_please
DATABASE_URL="file:./dev.db"
EOF
else
  echo ".env.development já existe, não sobrescrevi."
fi

if [ ! -f .env.production ]; then
  cat > .env.production <<'EOF'
NODE_ENV=production
PORT=3333
JWT_SECRET=change_this_in_production_please
DATABASE_URL="postgresql://user:password@localhost:5432/mini_saas?schema=public"
EOF
else
  echo ".env.production já existe, não sobrescrevi."
fi

backup_if_exists .gitignore
cat > .gitignore <<'EOF'
node_modules
dist
.env
.env.local
.env.*.local
*.db
*.db-journal
prisma/dev.db
EOF

write_file prisma/models.prisma <<'EOF'
model User {
  id           String       @id @default(cuid())
  name         String
  email        String       @unique
  passwordHash String?
  memberships  Membership[]
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
}

model Organization {
  id           String       @id @default(cuid())
  name         String
  slug         String       @unique
  memberships  Membership[]
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
}

model Membership {
  id             String       @id @default(cuid())

  // String para funcionar igual em SQLite DEV e PostgreSQL PROD.
  // Valores esperados: OWNER, ADMIN, MEMBER.
  role           String       @default("MEMBER")

  userId         String
  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)

  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  createdAt      DateTime     @default(now())

  @@unique([userId, organizationId])
  @@index([organizationId])
  @@index([userId])
}

model AuditLog {
  id             String   @id @default(cuid())
  action         String
  entity         String
  entityId       String?
  organizationId String?
  userId         String?

  // String para manter compatibilidade simples entre SQLite e PostgreSQL.
  // Guarde JSON serializado aqui se precisar.
  metadata       String?

  createdAt      DateTime @default(now())

  @@index([organizationId])
  @@index([userId])
  @@index([entity])
}
EOF

write_file scripts/write-prisma-schema.mjs <<'EOF'
import fs from "node:fs";
import path from "node:path";

const target = process.argv[2];

if (!["dev", "prod"].includes(target)) {
  console.error("Uso: node scripts/write-prisma-schema.mjs dev|prod");
  process.exit(1);
}

const provider = target === "dev" ? "sqlite" : "postgresql";

const modelsPath = path.resolve("prisma/models.prisma");
const schemaPath = path.resolve("prisma/schema.prisma");

const models = fs.readFileSync(modelsPath, "utf8");

const schema = `
// ATENÇÃO:
// Este arquivo é gerado automaticamente.
// Edite prisma/models.prisma, não este arquivo.

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "${provider}"
  url      = env("DATABASE_URL")
}

${models}
`;

fs.writeFileSync(schemaPath, schema.trimStart());

console.log(`Prisma schema gerado para: ${target} (${provider})`);
EOF

write_file src/lib/env.ts <<'EOF'
import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(12)
});

export const env = envSchema.parse(process.env);
EOF

write_file src/lib/prisma.ts <<'EOF'
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "production"
      ? ["error", "warn"]
      : ["query", "error", "warn"]
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
EOF

write_file src/plugins/cors.ts <<'EOF'
import fp from "fastify-plugin";
import cors from "@fastify/cors";

export const corsPlugin = fp(async (app) => {
  await app.register(cors, {
    origin: true,
    credentials: true
  });
});
EOF

write_file src/plugins/jwt.ts <<'EOF'
import fp from "fastify-plugin";
import jwt from "@fastify/jwt";
import { env } from "../lib/env.js";

export const jwtPlugin = fp(async (app) => {
  await app.register(jwt, {
    secret: env.JWT_SECRET
  });
});
EOF

write_file src/routes/health.routes.ts <<'EOF'
import type { FastifyInstance } from "fastify";

export async function healthRoutes(app: FastifyInstance) {
  app.get("/health", async () => {
    return {
      ok: true,
      service: "mini-saas-api"
    };
  });
}
EOF

write_file src/routes/users.routes.ts <<'EOF'
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
EOF

write_file src/routes/organizations.routes.ts <<'EOF'
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
EOF

write_file src/app.ts <<'EOF'
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
EOF

write_file src/server.ts <<'EOF'
import { buildApp } from "./app.js";
import { env } from "./lib/env.js";

const app = await buildApp();

try {
  await app.listen({
    port: env.PORT,
    host: "0.0.0.0"
  });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
EOF

npm install fastify @fastify/cors @fastify/jwt fastify-plugin @prisma/client zod dotenv
npm install -D typescript tsx prisma dotenv-cli @types/node

npm run db:dev

echo ""
echo "Setup concluído no repo atual."
echo ""
echo "Rodar DEV com SQLite:"
echo "  npm run dev"
echo ""
echo "Testar health:"
echo "  curl http://localhost:3333/health"
echo ""
echo "Criar usuário:"
echo "  curl -X POST http://localhost:3333/api/users -H 'Content-Type: application/json' -d '{\"name\":\"Kona\",\"email\":\"kona@example.com\"}'"
echo ""
echo "Criar organização:"
echo "  curl -X POST http://localhost:3333/api/organizations -H 'Content-Type: application/json' -d '{\"name\":\"Minha Empresa\",\"slug\":\"minha-empresa\"}'"
echo ""
echo "Produção:"
echo "  Ajuste .env.production"
echo "  npm run db:prod:create-migration -- --name init"
echo "  npm run build"
echo "  npm run start"
