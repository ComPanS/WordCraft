import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

export const getWordsRoute = async (req: Request, res: Response): Promise<void> => {
    try {
        const prisma = new PrismaClient()
        const collectionId = req.params.id
        const words = await prisma.word.findMany({
            where: {
                collectionId: collectionId,
            },
        })

        res.json(words)
    } catch (error) {
        res.status(500).json({ error: `${error}` })
    }
}
