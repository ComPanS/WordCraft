import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../src/axios'
import { env } from '../../src/lib/env'

// Интерфейс для коллекции
interface Collection {
    id: string
    title: string
    description?: string
    createdAt: string
    isPublic?: boolean
    language?: string
    blockedAt?: string
    isLikesByMe?: boolean
    likesCount?: number
    author: {
        id: string
        name: string
        avatar?: string
    }
    words: {
        id: string
        original: string
        translation: string
    }[]
}

// Интерфейс для состояния коллекций
interface CollectionsState {
    collections: Collection[]
    collectionsStatus: string
    ownCollections: Collection[]
    ownCollectionsStatus: string
    currentCollection: Collection | null
    currentCollectionStatus: string
}

// Начальное состояние
const initialState: CollectionsState = {
    collections: [],
    collectionsStatus: 'idle', // 'idle', 'loading', 'loaded', 'error'
    ownCollections: [],
    ownCollectionsStatus: 'idle', // 'idle', 'loading', 'loaded', 'error'
    currentCollection: null,
    currentCollectionStatus: 'idle', // 'idle', 'loading', 'loaded', 'error'
}

// Thunk для загрузки всех коллекций
export const fetchCollections = createAsyncThunk('collections/fetchCollections', async () => {
    const { data } = await axios.get(`${env.VITE_BACKEND_URL}api/collections`)
    return data
})

// Thunk для загрузки собственных коллекций
export const fetchOwnCollections = createAsyncThunk('collections/fetchOwnCollections', async () => {
    const { data } = await axios.get(`${env.VITE_BACKEND_URL}api/collections/own`)
    return data
})

// Thunk для загрузки конкретной коллекции по ID
export const fetchCollectionById = createAsyncThunk('collections/fetchCollectionById', async (id: string) => {
    const { data } = await axios.get(`${env.VITE_BACKEND_URL}api/collections/${id}`)
    return data
})

// Создание слайса
const collectionsSlice = createSlice({
    name: 'collections',
    initialState,
    reducers: {
        // Удаление коллекции
        removeCollection: (state, action) => {
            state.collections = state.collections.filter((obj) => obj.id !== action.payload)
        },
    },
    extraReducers: (builder) => {
        builder
            // Загрузка всех коллекций
            .addCase(fetchCollections.pending, (state) => {
                state.collectionsStatus = 'loading'
            })
            .addCase(fetchCollections.fulfilled, (state, action) => {
                state.collections = action.payload
                state.collectionsStatus = 'loaded'
            })
            .addCase(fetchCollections.rejected, (state) => {
                state.collectionsStatus = 'error'
            })

            // Загрузка собственных коллекций
            .addCase(fetchOwnCollections.pending, (state) => {
                state.ownCollectionsStatus = 'loading'
            })
            .addCase(fetchOwnCollections.fulfilled, (state, action) => {
                state.ownCollections = action.payload
                state.ownCollectionsStatus = 'loaded'
            })
            .addCase(fetchOwnCollections.rejected, (state) => {
                state.ownCollectionsStatus = 'error'
            })

            // Загрузка конкретной коллекции
            .addCase(fetchCollectionById.pending, (state) => {
                state.currentCollectionStatus = 'loading'
            })
            .addCase(fetchCollectionById.fulfilled, (state, action) => {
                state.currentCollection = action.payload
                state.currentCollectionStatus = 'loaded'
            })
            .addCase(fetchCollectionById.rejected, (state) => {
                state.currentCollectionStatus = 'error'
            })
    },
})

// Экспорт редьюсера и действий
export const collectionsReducer = collectionsSlice.reducer
export const { removeCollection } = collectionsSlice.actions
