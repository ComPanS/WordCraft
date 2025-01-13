// <reference path="../../../types/express.d.ts" />

import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

export const setCollectionLikeRoute = async (req: Request, res: Response): Promise<void> => {
    const prisma = new PrismaClient()
    const collectionId = req.params.id
    const userId = await req.userId

    try {
        const collection = await prisma.collection.findUnique({
            where: {
                id: collectionId,
            },
        })

        if (!collection) {
            throw new Error('NOT_FOUND')
        }

        const collectionLike = await prisma.collectionLike.findFirst({
            where: {
                collectionId: collectionId,
                userId: userId,
            },
        })
        let message = ''

        if (collectionLike) {
            message = 'Collection like removed'
            await prisma.collectionLike.delete({
                where: {
                    collectionId_userId: {
                        collectionId: collectionId,
                        userId: userId,
                    },
                },
            })
        } else {
            message = 'Collection like set'
            await prisma.collectionLike.upsert({
                where: {
                    collectionId_userId: {
                        collectionId: collectionId,
                        userId: userId,
                    },
                },
                create: {
                    userId: userId,
                    collectionId: collectionId,
                },
                update: {},
            })
        }

        res.status(200).json({
            id: collectionId,
            likesCount: await prisma.collectionLike.count({
                where: {
                    collectionId: collectionId,
                },
            }),
            message: message,
        })
    } catch (error) {
        res.status(500).json({ error: `${error}` })
    } finally {
        await prisma.$disconnect()
    }
}
