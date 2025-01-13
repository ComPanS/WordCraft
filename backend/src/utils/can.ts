import type { Collection, User, UserPermission } from '@prisma/client'

type MaybeUser = Pick<User, 'permissions' | 'id'> | null
type MaybeCollection = Pick<Collection, 'authorId'> | null

export const hasPermission = (user: MaybeUser, permission: UserPermission) => {
    return user?.permissions.includes(permission) || user?.permissions.includes('ALL') || false
}

export const canBlockIdeas = (user: MaybeUser) => {
    return hasPermission(user, 'BLOCK_COLLECTION')
}

export const canEditCollection = (user: MaybeUser, collection: MaybeCollection) => {
    return !!user && !!collection && user?.id === collection?.authorId
}
