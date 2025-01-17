import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../src/axios'

export const fetchWords = createAsyncThunk('/words/fetchWords', async () => {
    const { data } = await axios.get('/api/words')
    return data
})

interface Word {
    id: string
    // add other properties of the word if needed
}

const initialState: { words: Word[]; wordsStatus: string } = {
    words: [],
    wordsStatus: 'loading',
}

const wordsSlice = createSlice({
    name: 'words',
    initialState,
    reducers: {
        removeWord: (state, action) => {
            state.words = state.words.filter((obj) => obj.id !== action.payload)
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWords.fulfilled, (state, action) => {
                state.words = action.payload
                state.wordsStatus = 'loaded'
            })
            .addCase(fetchWords.pending, (state) => {
                state.words = []
                state.wordsStatus = 'loading'
            })
            .addCase(fetchWords.rejected, (state) => {
                state.words = []
                state.wordsStatus = 'error'
            })
    },
})

export const wordsReducer = wordsSlice.reducer
export const { removeWord } = wordsSlice.actions
