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

import { createWordRoute } from './router/words/createWord'
import { getWordRoute } from './router/words/getWord'
import { getWordsRoute } from './router/words/getWords'
import { updateWordRoute } from './router/words/updateWord'

void (async () => {
    try {
        const app = express()
        app.use(express.json())
        app.use(cors())

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
        app.get('/api/collections/:id/words', getWordsRoute)
        app.patch('/api/word/:id', checkAuth, createWordValidation, handleValidationErrors, updateWordRoute)

        app.listen(env.PORT, () => {
            console.info('Server is running on http://localhost:' + env.PORT)
        })
    } catch (error) {
        console.error(error)
    }
})()
