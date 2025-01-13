import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

export const createWordRoute = async (req: Request, res: Response): Promise<void> => {
    try {
        const prisma = new PrismaClient()
        const collectionId = req.params.id
        const collection = await prisma.collection.findUnique({
            where: {
                id: collectionId,
            },
            select: {
                language: true,
            },
        })

        if (!collection) {
            res.status(404).json({ error: 'Collection not found' })
            return
        }

        const { original, translation } = req.body
        const newWord = await prisma.word.create({
            data: {
                original: original,
                translation: translation,
                language: collection.language,
                collectionId: collectionId,
            },
        })
        res.json(newWord)
    } catch (error) {
        res.status(500).json({ error: `${error}` })
    }
}
