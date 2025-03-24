import { PrismaClient } from '@prisma/client'
import { signJWT } from '../../../utils/signJWT'
import { getPasswordHash } from '../../../utils/getPasswordHash'
import { ExpectedError } from '../../../lib/error'
import { Request, Response } from 'express'

export const signUpRoute = async (req: Request, res: Response): Promise<void> => {
    try {
        const prisma = new PrismaClient()
        const { email, password, name } = req.body

        const exUserWithEmail = await prisma.user.findUnique({
            where: {
                email,
            },
        })

        if (exUserWithEmail) {
            res.status(400).json({ message: 'User with this email already exists' })
            return
            // throw new ExpectedError('User with this email already exists')
        }

        const hashedPassword = await getPasswordHash(password)

        const newUser = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword,
                name: name,
            },
        })

        const token = signJWT(newUser.id)
        const { password: _, ...userData } = newUser

        res.json({
            ...userData,
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
