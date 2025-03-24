import express from 'express'
import cors from 'cors'
import { env } from './lib/env'

import {
    signInValidation,
    signUpValidation,
    newPasswordValidation,
    createCollectionValidation,
    createWordValidation,
} from './lib/validations'
import handleValidationErrors from './utils/handleValidationErrors'
import checkAuth from './utils/checkAuth'

import { signUpRoute } from './router/auth/signUp'
import { signInRoute } from './router/auth/signIn'
import { getMeRoute } from './router/auth/getMe'
import { updateProfileRoute } from './router/auth/updateProfile'
import { updatePasswordRoute } from './router/auth/updatePassword'

import { createCollectionRoute } from './router/collections/createCollection'
import { getCollectionRoute } from './router/collections/getCollection'
import { getCollectionsRoute } from './router/collections/getCollections'
import { updateCollectionRoute } from './router/collections/updateCollection'
import { blockCollectionRoute } from './router/collections/blockCollection'
import { setCollectionLikeRoute } from './router/collections/setCollectionLike'
import { deleteCollectionRoute } from './router/collections/deleteCollection'
import { getOwnCollectionsRoute } from './router/collections/getOwnCollections'

import { createWordRoute } from './router/words/createWord'
import { deleteWordRoute } from './router/words/deleteWord'
import { getWordRoute } from './router/words/getWord'
import { getWordsRoute } from './router/words/getWords'
import { updateWordRoute } from './router/words/updateWord'
import { getRandomWordsFromCollection } from './router/words/getRandomWords'

void (async () => {
    try {
        const app = express()
        app.use(express.json())
        const corsOptions = {
            origin: 'http://localhost:8000', // Укажите точный источник
            credentials: true, // Разрешите отправку учетных данных (например, куки)
        }
        app.use(cors(corsOptions))

        app.post('/api/auth/sign-in', signInValidation, handleValidationErrors, signInRoute)
        app.post('/api/auth/sign-up', signUpValidation, handleValidationErrors, signUpRoute)
        app.get('/api/auth/me', checkAuth, handleValidationErrors, getMeRoute)
        app.patch('/api/auth/updateProfileRoute', checkAuth, handleValidationErrors, updateProfileRoute)
        app.patch(
            '/api/auth/updatePasswordRoute',
            checkAuth,
            newPasswordValidation,
            handleValidationErrors,
            updatePasswordRoute
        )

        app.post(
            '/api/collections/create-collection',
            checkAuth,
            createCollectionValidation,
            handleValidationErrors,
            createCollectionRoute
        )
        app.get('/api/collections/own', checkAuth, getOwnCollectionsRoute)
        app.get('/api/collections/:id', getCollectionRoute)
        app.get('/api/collections', getCollectionsRoute)
        app.patch(
            '/api/collections/:id',
            checkAuth,
            createCollectionValidation,
            handleValidationErrors,
            updateCollectionRoute
        )
        app.patch('/api/collections/block/:id', checkAuth, handleValidationErrors, blockCollectionRoute)
        app.patch('/api/collections/setcollectionlike/:id', checkAuth, handleValidationErrors, setCollectionLikeRoute)
        app.delete('/api/collections/delete/:id', checkAuth, handleValidationErrors, deleteCollectionRoute)

        app.post(
            '/api/collections/:id/create-word',
            checkAuth,
            createWordValidation,
            handleValidationErrors,
            createWordRoute
        )
        app.get('/api/words/:id', checkAuth, handleValidationErrors, getWordRoute)
        app.delete('/api/word/:id/delete', checkAuth, deleteWordRoute)
        app.get('/api/collections/:id/words', getWordsRoute)
        app.patch('/api/word/:id/updateword', checkAuth, createWordValidation, handleValidationErrors, updateWordRoute)
        app.post('/api/collections/:id/randomwords', getRandomWordsFromCollection)

        app.listen(env.PORT, () => {
            console.info('Server is running on http://localhost:' + env.PORT)
        })
    } catch (error) {
        console.error(error)
    }
})()
