import { pick } from '@wordcraft/shared/src/pick'
import { type User } from '@prisma/client'

export const toClientMe = (user: User | null) => {
    return user && pick(user, ['id', 'email', 'name', 'permissions', 'avatar'])
}
