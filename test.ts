import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import "dotenv/config";

const adapter = new PrismaMariaDb({
    host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
    port: 4000,
    user: '4QCAgL5shuMBjzi.root',
    password: process.env.DATABASE_URL!.match(/:([^:@]+)@/)?.[1] || 'JCfQXRGquvl7Wm8U',
    database: 'noticeboard',
    ssl: { rejectUnauthorized: false },
    connectTimeout: 20000
});

const prisma = new PrismaClient({ adapter });

async function main() {
    const notices = await prisma.notice.findMany();
    console.log(notices);
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });