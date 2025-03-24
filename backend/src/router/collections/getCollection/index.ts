import { PrismaClient } from '@prisma/client'
import { ExpectedError } from '../../../lib/error'
import { Request, Response } from 'express'
import { omit } from '@wordcraft/shared/src/omit'

export const getCollectionRoute = async (req: Request, res: Response): Promise<void> => {
    try {
        const collectionId = req.params.id
        const prisma = new PrismaClient()

        const rawCollection = await prisma.collection.findUnique({
            where: { id: collectionId },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
                collectionLikes: {
                    select: {
                        id: true,
                    },
                    where: {
                        userId: req?.userId,
                    },
                },
                words: {
                    select: {
                        id: true,
                        original: true,
                        translation: true,
                    },
                },
                _count: {
                    select: {
                        collectionLikes: true,
                    },
                },
            },
        })

        if (!rawCollection) {
            throw new ExpectedError('Collection not found')
        }

        if (rawCollection?.blockedAt) {
            throw new ExpectedError('Idea is blocked by administrator')
        }

        const isLikesByMe = !!rawCollection?.collectionLikes.length
        const likesCount = rawCollection?._count.collectionLikes
        const collection = rawCollection && {
            ...omit(rawCollection, ['collectionLikes', '_count']),
            isLikesByMe,
            likesCount,
        }

        res.json(collection)
    } catch (error) {
        res.status(500).json({ error: `${error}` })
    }
}
