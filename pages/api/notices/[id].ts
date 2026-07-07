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
const UpdateNoticeSchema = NoticeSchema.partial();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "PUT") {
        return updateNotice(req, res);
    } else if (req.method === "DELETE") {
        return deleteNotice(req, res);
    } else {
        res.setHeader("Allow", ["PUT", "DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

async function updateNotice(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        const validatedData = UpdateNoticeSchema.parse(req.body);

        const notice = await prisma.notice.update({
            where: { id: String(id) },
            data: validatedData
        });
        return res.status(200).json(notice);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error(error);
        return res.status(500).json({ error: "Failed to update notice" });
    }
}

async function deleteNotice(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        await prisma.notice.delete({
            where: { id: String(id) }
        });
        return res.status(204).end();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to delete notice" });
    }
}
