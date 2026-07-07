import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { z } from "zod";

const NoticeSchema = z.object({
    title: z.string().min(1),
    body: z.string().min(1),
    category: z.enum(["EXAM", "EVENT", "GENERAL"]),
    priority: z.enum(["NORMAL", "URGENT"]),
    publishDate: z.coerce.date(),
    image: z.string().optional()
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        return getNotices(req, res);
    } else if (req.method === "POST") {
        return createNotice(req, res);
    } else {
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

async function getNotices(req: NextApiRequest, res: NextApiResponse) {
    try {
        const notices = await prisma.notice.findMany({
            orderBy: [
                { priority: "desc" },
                { publishDate: "desc" }
            ]
        });
        return res.status(200).json(notices);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to fetch notices" });
    }
}

async function createNotice(req: NextApiRequest, res: NextApiResponse) {
    try {
        const validatedData = NoticeSchema.parse(req.body);

        const notice = await prisma.notice.create({
            data: validatedData
        });
        return res.status(201).json(notice);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error(error);
        return res.status(500).json({ error: "Failed to create notice" });
    }
}
