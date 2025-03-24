import { PrismaClient } from '@prisma/client'
import { ExpectedError } from '../../../lib/error'
import { Request, Response } from 'express'

export const getOwnCollectionsRoute = async (req: Request, res: Response): Promise<void> => {
    try {
        const prisma = new PrismaClient()
        const userId = req.userId // ID текущего пользователя

        if (!userId) {
            throw new ExpectedError('User ID is missing') // Проверяем, что userId существует
        }

        // Получаем коллекции, где authorId равен userId
        const collections = await prisma.collection.findMany({
            where: {
                authorId: userId, // Фильтруем по автору
            },
            include: {
                collectionLikes: {
                    select: {
                        id: true,
                    },
                    where: {
                        userId: req.userId, // Фильтр лайков текущего пользователя
                    },
                },
                _count: {
                    select: {
                        collectionLikes: true, // Агрегируем количество лайков
                    },
                },
            },
        })

        if (!collections) {
            throw new ExpectedError('You have not collections yet')
        }

        res.json(collections)
    } catch (error) {
        if (error instanceof ExpectedError) {
            res.status(400).json({ error: error.message }) // Ошибки валидации
        } else {
            res.status(500).json({ error: `${error}` }) // Остальные ошибки
        }
    }
}
