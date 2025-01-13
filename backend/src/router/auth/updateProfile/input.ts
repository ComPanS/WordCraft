import { body } from 'express-validator'

export const newPasswordValidation = [
    body('newPassword', 'Password should be at least 6 characters long').isLength({ min: 6 }),
]
