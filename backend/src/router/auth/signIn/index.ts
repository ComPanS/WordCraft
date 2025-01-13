import { PrismaClient } from '@prisma/client'
import { signJWT } from '../../../utils/signJWT'
import { getPasswordHash } from '../../../utils/getPasswordHash'
import { ExpectedError } from '../../../lib/error'
import { Request, Response } from 'express'

export const signInRoute = async (req: Request, res: Response): Promise<void> => {
    try {
        const prisma = new PrismaClient()
        const { email, password } = req.body

        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        })

        if (!user) {
            throw new ExpectedError('User with this email does not exist')
        }

        const isPasswordValid = (await getPasswordHash(password)) === user.password

        if (!isPasswordValid) {
            throw new ExpectedError('Password or email is incorrect')
        }

        const token = signJWT(user.id)
        const { password: _, ...userData } = user

        res.json({
            userData,
            token,
        })
    } catch (error) {
        if (error instanceof ExpectedError) {
            res.status(400).json({ error: error.message })
        } else {
            res.status(500).json({ error: 'Something went wrong' })
        }
    }
}
