import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

export const getCollectionsRoute = async (req: Request, res: Response): Promise<void> => {
    try {
        const prisma = new PrismaClient()
        const collections = await prisma.collection.findMany()

        res.json(collections)
    } catch (error) {
        res.status(500).json({ error: `${error}` })
    }
}
