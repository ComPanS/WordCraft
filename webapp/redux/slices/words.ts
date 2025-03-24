import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../src/axios'

// Асинхронный Thunk для получения всех слов
export const fetchWords = createAsyncThunk('/words/fetchWords', async () => {
    const { data } = await axios.get('/api/words')
    return data
})

// Асинхронный Thunk для получения случайных слов из коллекции
export const fetchRandomWords = createAsyncThunk(
    '/words/fetchRandomWords',
    async ({ collectionId, count }: { collectionId: string; count: number }) => {
        const { data } = await axios.post(`/api/collections/${collectionId}/randomwords`, { count })
        return data
    }
)
interface Word {
    id: string
    original: string
    translate: string
    // Другие свойства слова, если необходимо
}

interface WordsState {
    words: Word[]
    randomWords: Word[] // Новое поле для хранения случайных слов
    wordsStatus: string
    randomWordsStatus: string // Статус загрузки случайных слов
}

const initialState: WordsState = {
    words: [],
    randomWords: [], // Инициализация нового поля
    wordsStatus: 'loading',
    randomWordsStatus: 'idle', // Начальное состояние для случайных слов
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
            // Обработчики для fetchWords
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
            // Обработчики для fetchRandomWords
            .addCase(fetchRandomWords.fulfilled, (state, action) => {
                state.randomWords = action.payload
                state.randomWordsStatus = 'loaded'
            })
            .addCase(fetchRandomWords.pending, (state) => {
                state.randomWords = []
                state.randomWordsStatus = 'loading'
            })
            .addCase(fetchRandomWords.rejected, (state) => {
                state.randomWords = []
                state.randomWordsStatus = 'error'
            })
    },
})

export const wordsReducer = wordsSlice.reducer
export const { removeWord } = wordsSlice.actions
