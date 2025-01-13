import { body } from 'express-validator'

export const createCollectionValidation = [
    body('title', 'Введите название коллекции').isString().isLength({ min: 1 }),
    body('description', 'Введите описание коллекции').optional().isString().isLength({ min: 1 }),
]
