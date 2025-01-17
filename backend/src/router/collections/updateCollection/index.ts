// <reference path="../../../types/express.d.ts" />

import { PrismaClient } from '@prisma/client'
import { ExpectedError } from '../../../lib/error'
import { Request, Response } from 'express'

export const updateCollectionRoute = async (req: Request, res: Response): Promise<void> => {
    try {
        const postId = req.params.id
        const prisma = new PrismaClient()

        const post = await prisma.collection.findUnique({
            where: { id: postId },
        })

        if (!post) {
            throw new ExpectedError('Collection not found')
        }

        if (post.authorId !== req.userId) {
            throw new ExpectedError('You are not the owner of this collection')
        }

        const { title, description, isPublic, language } = req.body

        const updatedCollection = await prisma.collection.update({
            where: { id: postId },
            data: {
                title: title,
                description: description,
                isPublic: isPublic,
                language: language,
            },
        })

        res.json(updatedCollection)
    } catch (error) {
        res.status(500).json({ error: `${error}` })
    }
}
