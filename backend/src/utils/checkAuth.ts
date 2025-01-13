// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../@types/express.d.ts" />

import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { env } from '../lib/env'

export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

    if (token) {
        try {
            const decoded = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload

            req.userId = decoded.userId
            next()
            return
        } catch (error) {
            res.status(403).json({
                message: error,
            })
        }
    } else {
        res.status(403).json({
            message: 'Нет доступа',
        })
    }
}
