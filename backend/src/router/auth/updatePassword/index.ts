// <reference path="../../../types/express.d.ts" />

import { PrismaClient } from '@prisma/client'
import { getPasswordHash } from '../../../utils/getPasswordHash'
import { ExpectedError } from '../../../lib/error'
import { Request, Response } from 'express'

export const updatePasswordRoute = async (req: Request, res: Response): Promise<void> => {
    try {
        const prisma = new PrismaClient()
        const { newPassword } = req.body

        const user = await prisma.user.findUnique({
            where: {
                id: req.userId,
            },
        })

        if (!user) {
            throw new Error('User not found')
        }

        const hashedPassword = await getPasswordHash(newPassword)

        const isPasswordSame: boolean = hashedPassword === user.password

        if (isPasswordSame == true) {
            throw new ExpectedError('New password cannot be the same as the old password')
        }

        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                password: hashedPassword,
            },
        })

        res.json({ message: 'Password updated' })
    } catch (error) {
        if (error instanceof ExpectedError) {
            res.status(400).json({ error: error.message })
        } else {
            res.status(500).json({ error: 'Something went wrong' })
        }
    }
}
