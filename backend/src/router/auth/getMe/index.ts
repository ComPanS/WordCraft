// import '../../../@types/express.ts'

import { PrismaClient } from '@prisma/client'
import { ExpectedError } from '../../../lib/error'
import { Request, Response } from 'express'

export const getMeRoute = async (req: Request, res: Response): Promise<void> => {
    try {
        const prisma = new PrismaClient()
        const user = await prisma.user.findUnique({
            where: {
                id: req.userId,
            },
        })

        if (!user) {
            throw new ExpectedError('User with this id does not exist')
        }

        res.json({
            userId: user.id,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
        })
    } catch (error) {
        if (error instanceof ExpectedError) {
            res.status(400).json({ error: error.message })
        } else {
            res.status(500).json({ error: 'Something went wrong' })
        }
    }
}
