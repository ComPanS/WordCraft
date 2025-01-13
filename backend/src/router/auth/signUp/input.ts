import { body } from 'express-validator'

export const signUpValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть не менее 6 символов').isLength({ min: 6 }),
    body('name', 'Имя должно быть не менее 2 символов').isLength({ min: 2 }),
    body('avatar', 'Неверный формат ссылки на аватар').optional().isURL(),
]
