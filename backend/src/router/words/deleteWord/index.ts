import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

export const deleteWordRoute = async (req: Request, res: Response): Promise<void> => {
    try {
        const prisma = new PrismaClient()
        const { id } = req.params

        // Проверяем, существует ли слово
        const word = await prisma.word.findUnique({
            where: { id: id },
        })

        if (!word) {
            res.status(404).json({ error: 'Word not found' })
            return
        }

        // Удаляем слово
        await prisma.word.delete({
            where: { id: id },
        })

        res.json({ message: 'Word deleted successfully' })
    } catch (error) {
        res.status(500).json({ error: `${error}` })
    }
}
