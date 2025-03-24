import { pgr } from '../utils/pumpGetRoute'

export const getAllCollectionsRoute = pgr(() => '/')

export const getSignInRoute = pgr(() => '/sign-in')
export const getSignUpRoute = pgr(() => '/sign-up')
export const getProfileRoute = pgr(() => '/profile')
export const getEditProfileRoute = pgr(() => '/profile/edit')

export const getViewCollectionRoute = pgr({ id: true }, (params) => `/collection/${params.id}`)
export const getEditCollectionRoute = pgr({ id: true }, (params) => `/collection/${params.id}/edit`)
export const getCreateCollectionRoute = pgr(() => 'collection/create')
export const getOwnCollectionRoute = pgr(() => 'collections/own')
