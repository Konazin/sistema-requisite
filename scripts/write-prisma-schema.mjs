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
