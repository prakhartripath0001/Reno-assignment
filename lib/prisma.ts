import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import mariadb from "mariadb";

const globalForPrisma = global as unknown as {
    prisma: PrismaClient | undefined;
};

let adapter: PrismaMariaDb | undefined = undefined;

if (!globalForPrisma.prisma) {
    adapter = new PrismaMariaDb({
        host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
        port: 4000,
        user: '4QCAgL5shuMBjzi.root',
        password: process.env.DATABASE_URL!.match(/:([^:@]+)@/)?.[1] || 'JCfQXRGquvl7Wm8U',
        database: 'noticeboard',
        ssl: { rejectUnauthorized: true }
    });
}

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}