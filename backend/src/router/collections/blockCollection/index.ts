// <reference path="../../../types/express.d.ts" />

import { PrismaClient } from '@prisma/client'
import { ExpectedError } from '../../../lib/error'
import { Request, Response } from 'express'

export const blockCollectionRoute = async (req: Request, res: Response): Promise<void> => {
    try {
        const collectionId = req.params.id
        const prisma = new PrismaClient()

        const collection = await prisma.collection.findUnique({
            where: { id: collectionId },
        })

        if (!collection) {
            throw new ExpectedError('Collection not found')
        }

        const isBlocked = collection.blockedAt !== null ? true : false

        if (isBlocked) {
            throw new ExpectedError('Collection is already blocked')
        }

        const updatedCollection = await prisma.collection.update({
            where: { id: collectionId },
            data: {
                blockedAt: new Date(),
            },
        })

        res.json(updatedCollection)
    } catch (error) {
        res.status(500).json({ error: `${error}` })
    }
}
