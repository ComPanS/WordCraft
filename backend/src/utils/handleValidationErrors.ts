import { validationResult } from 'express-validator'
import { Request, Response, NextFunction } from 'express'

export default (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ message: errors.array()[0].msg })
        return Promise.resolve()
    }

    next()
    return Promise.resolve()
}
