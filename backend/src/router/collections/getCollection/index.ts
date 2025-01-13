import { PrismaClient } from '@prisma/client'
import { ExpectedError } from '../../../lib/error'
import { Request, Response } from 'express'

export const getCollectionRoute = async (req: Request, res: Response): Promise<void> => {
    try {
        const collectionId = req.params.id
        const prisma = new PrismaClient()

        const collection = await prisma.collection.findUnique({
            where: { id: collectionId },
        })

        if (!collection) {
            throw new ExpectedError('Collection not found')
        }

        res.json(collection)
    } catch (error) {
        res.status(500).json({ error: `${error}` })
    }
}
