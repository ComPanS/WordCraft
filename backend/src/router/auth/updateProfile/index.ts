// import '../../../@types/express.ts'

import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import { toClientMe } from '../../../lib/models'

export const updateProfileRoute = async (req: Request, res: Response): Promise<void> => {
    try {
        const prisma = new PrismaClient()
        const { name, email, avatar } = req.body

        const user = await prisma.user.findUnique({
            where: {
                id: req.userId,
            },
        })

        if (!user) {
            throw new Error('User not found')
        }

        const updatedMe = await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                name: name,
                email: email,
                avatar: avatar,
            },
        })

        res.json(toClientMe(updatedMe))
    } catch (error) {
        res.status(500).json({ error: `${error}` })
    }
}
