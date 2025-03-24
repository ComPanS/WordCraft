import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

export const getCollectionsRoute = async (req: Request, res: Response): Promise<void> => {
    try {
        const prisma = new PrismaClient()
        const rawCollections = await prisma.collection.findMany({
            where: {
                isPublic: true, // Условие для фильтрации публичных коллекций
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

        const collections = rawCollections.map((collection) => ({
            ...collection,
            isLikesByMe: collection.collectionLikes.length > 0, // Проверяем, лайкнул ли текущий пользователь
            likesCount: collection._count.collectionLikes, // Количество лайков
        }))

        res.json(collections)
    } catch (error) {
        res.status(500).json({ error: `${error}` })
    }
}
