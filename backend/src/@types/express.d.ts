import 'express'

declare global {
    namespace Express {
        export interface Request {
            userId: string // или number, в зависимости от типа id
        }
    }
}
