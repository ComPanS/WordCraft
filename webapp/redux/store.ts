import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from './slices/auth'
import { collectionsReducer } from './slices/collections'
import { wordsReducer } from './slices/words'

const store = configureStore({
    reducer: {
        auth: authReducer,
        collections: collectionsReducer,
        words: wordsReducer,
    },
})

export default store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
