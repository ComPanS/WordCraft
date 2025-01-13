// <reference path="../../../types/express.d.ts" />

import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()
export const createCollectionRoute = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, isPublic, language } = req.body
        const newCollection = await prisma.collection.create({
            data: {
                title: title,
                description: description,
                isPublic: isPublic,
                language: language,
                authorId: req.userId,
            },
        })
        res.json(newCollection)
    } catch (error) {
        res.status(500).json({ error: `${error}` })
    }
}
