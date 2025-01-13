import { body } from 'express-validator'

export const signInValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть не менее 6 символов').isLength({ min: 6 }),
]
