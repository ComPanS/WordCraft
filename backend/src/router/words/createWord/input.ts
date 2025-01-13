import { body } from 'express-validator'

export const createWordValidation = [
    body('original', 'Введите слово на оригинальном языке').isString().isLength({ min: 1 }),
    body('translation', 'Введите перевод слова').isString().isLength({ min: 1 }),
]
