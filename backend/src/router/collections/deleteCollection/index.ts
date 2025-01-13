import { PrismaClient, Prisma } from '@prisma/client'
import { Request, Response } from 'express'

export const deleteCollectionRoute = async (req: Request, res: Response): Promise<void> => {
    const prisma = new PrismaClient()
    const collectionId = req.params.id

    try {
        // Удаление коллекции
        await prisma.collection.delete({
            where: {
                id: collectionId,
            },
        })

        res.json({ message: 'Collection deleted' })
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // Обработка ошибки нарушения внешнего ключа
            res.status(400).json({ error: 'Cannot delete collection due to foreign key constraint' })
        } else {
            res.status(500).json({ error: `${error}` })
        }
    } finally {
        await prisma.$disconnect()
    }
}
