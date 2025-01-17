import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../src/axios'
import { sharedEnv } from '@wordcraft/shared/src/env'
import { env } from '../../src/lib/env'

export const fetchCollections = createAsyncThunk('/collections/fetchCollections', async () => {
    const { data } = await axios.get(`${env.VITE_BACKEND_URL}api/collections`)
    return data
})

interface Collection {
    id: string
    // add other properties of the collection if needed
}

const initialState: { collections: Collection[]; collectionsStatus: string } = {
    collections: [],
    collectionsStatus: 'loading',
}

const collectionsSlice = createSlice({
    name: 'collections',
    initialState,
    reducers: {
        removeCollection: (state, action) => {
            state.collections = state.collections.filter((obj) => obj.id !== action.payload)
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCollections.fulfilled, (state, action) => {
                state.collections = action.payload
                state.collectionsStatus = 'loaded'
            })
            .addCase(fetchCollections.pending, (state) => {
                state.collections = []
                state.collectionsStatus = 'loading'
            })
            .addCase(fetchCollections.rejected, (state) => {
                state.collections = []
                state.collectionsStatus = 'error'
            })
    },
})

export const collectionsReducer = collectionsSlice.reducer
export const { removeCollection } = collectionsSlice.actions
