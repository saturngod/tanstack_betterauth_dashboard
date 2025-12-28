import { betterAuth } from "better-auth";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { prismaAdapter } from "better-auth/adapters/prisma";

console.log("DB URL:", process.env.DATABASE_USER);
const adapter = new PrismaMariaDb({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    connectionLimit: 5
});
console.log("Adapter setup Done");

const prisma = new PrismaClient({ adapter });

console.log("Prisma setup Done");

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "mysql",
    }),
    emailAndPassword: {
        enabled: true
    },
    plugins: [tanstackStartCookies()]
});

