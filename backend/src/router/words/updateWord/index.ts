import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

export const updateWordRoute = async (req: Request, res: Response): Promise<void> => {
    try {
        const prisma = new PrismaClient()
        const wordId = req.params.id
        const word = await prisma.word.findUnique({
            where: {
                id: wordId,
            },
        })

        if (!word) {
            res.status(404).json({ error: 'Word not found' })
            return
        }

        const { original, translation } = req.body
        const updatedWord = await prisma.word.update({
            where: {
                id: wordId,
            },
            data: {
                original: original,
                translation: translation,
            },
        })
        res.json(updatedWord)
    } catch (error) {
        res.status(500).json({ error: `${error}` })
    }
}
