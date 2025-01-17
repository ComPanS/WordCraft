import { PrismaClient, Prisma } from '@prisma/client'
import { Request, Response } from 'express'
import { ExpectedError } from '../../../lib/error'

export const deleteCollectionRoute = async (req: Request, res: Response): Promise<void> => {
    const prisma = new PrismaClient()
    const collectionId = req.params.id
    const userId = req.userId // Assuming user ID is stored in req.user

    // Проверка, является ли пользователь владельцем коллекции
    const collection = await prisma.collection.findUnique({
        where: {
            id: collectionId,
        },
        select: {
            authorId: true,
        },
    })

    if (!collection || collection.authorId !== userId) {
        throw new ExpectedError('You are not the owner of this collection')
        return
    }
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
