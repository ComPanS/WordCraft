import { pgr } from '../utils/pumpGetRoute'

export const getAllCollectionsRoute = pgr(() => '/')

export const getViewCollectionRoute = pgr({ id: true }, (params) => `/collection/${params.id}`)
