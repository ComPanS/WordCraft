import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCollectionById } from '../../../../redux/slices/collections'
import { type AppDispatch } from '../../../../redux/store'
import { Link, useParams } from 'react-router-dom'
import styles from './index.module.scss'
import format from 'date-fns/format'
import { getEditCollectionRoute } from '../../../lib/routes'
import axios from '../../../axios'
import ModalWindow from '../../../components/ModalWindow'
import { fetchRandomWords } from '../../../../redux/slices/words'

interface Collection {
    id: string
    title: string
    description?: string
    createdAt: string
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
    isLikesByMe: boolean
    likesCount: number
}

interface User {
    userId: string
    name: string
}

export const ViewCollectionPage = () => {
    const [original, setOriginal] = useState('')
    const [translation, setTranslation] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [count, setCount] = useState(5)
    const [currentWordIndex, setCurrentWordIndex] = useState(0)
    const [isRandomWordHidden, setIsRandomWordHidden] = useState(true)
    const [editingWord, setEditingWord] = useState<{ id: string; original: string; translation: string } | null>(null)

    const { currentCollection, currentCollectionStatus } = useSelector(
        (state: { collections: { currentCollection: Collection | null; currentCollectionStatus: string } }) =>
            state.collections
    )
    const { randomWords, randomWordsStatus } = useSelector((state: { words: any }) => state.words)
    const user = useSelector((state: { auth: { data: User | null } }) => state.auth.data)
    const { id } = useParams<{ id: string }>()
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        if (id) {
            dispatch(fetchCollectionById(id))
        }
    }, [dispatch, id])

    const handleAddWord = async () => {
        if (!original || !translation || !id) return
        try {
            await axios.post(`/api/collections/${id}/create-word`, { original, translation })
            dispatch(fetchCollectionById(id))
            setOriginal('')
            setTranslation('')
        } catch (error) {
            console.error('Error word adding:', error)
        }
    }

    const openModal = async () => {
        setIsModalOpen(true)
        setCurrentWordIndex(0)
        if (id) {
            dispatch(fetchRandomWords({ collectionId: id, count: Number(count) }))
        }
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }

    const handleNextWord = () => {
        if (currentWordIndex < randomWords.length - 1) {
            setCurrentWordIndex((prevIndex) => prevIndex + 1)
        } else {
            closeModal()
        }
    }

    const handlePrevWord = () => {
        if (currentWordIndex > 0) {
            setCurrentWordIndex((prevIndex) => prevIndex - 1)
        }
    }

    const handleLikeCollection = async () => {
        if (!id) return
        try {
            await axios.patch(`/api/collections/setcollectionlike/${id}`)
            dispatch(fetchCollectionById(id))
        } catch (error) {
            console.error('Ошибка при лайке коллекции:', error)
        }
    }

    if (currentCollectionStatus === 'loading') {
        return <div>Loading...</div>
    }

    if (currentCollectionStatus === 'error' || !currentCollection || !id) {
        return <p>Collection not found</p>
    }

    const createdAtDate = new Date(currentCollection.createdAt)
    const isAuthor = user && currentCollection.author.id === user.userId
    const reversedWords = [...currentCollection.words].reverse()

    return (
        <div className={styles.collection}>
            <div className={styles.collection_information}>
                {currentCollection.words.length > 0 && (
                    <>
                        <label>
                            Count of words
                            <input
                                type="number"
                                value={count}
                                onChange={(e) => setCount(Number(e.target.value))}
                                min="1"
                                max={currentCollection.words.length}
                            />
                        </label>
                        <button onClick={openModal}>Generate random words</button>
                    </>
                )}

                <h2>{currentCollection.title}</h2>
                <h3>Автор: {currentCollection.author.name}</h3>
                {currentCollection.author.avatar && <img src={currentCollection.author.avatar} alt="Аватар автора" />}
                <p>{format(createdAtDate, 'yyyy.MM.dd')}</p>
                {isAuthor && <Link to={getEditCollectionRoute({ id })}>Edit</Link>}
                <button onClick={handleLikeCollection}>Like ❤️ ({currentCollection.likesCount || 0})</button>

                <table className={styles.wordsTable}>
                    <thead>
                        <tr>
                            <th>Original</th>
                            <th>Translation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isAuthor && (
                            <tr>
                                <td>
                                    <input
                                        type="text"
                                        placeholder="Input original word"
                                        value={original}
                                        onChange={(e) => setOriginal(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        placeholder="Input translate"
                                        value={translation}
                                        onChange={(e) => setTranslation(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <button onClick={handleAddWord}>Add</button>
                                </td>
                            </tr>
                        )}
                        {reversedWords.map((word) => (
                            <tr
                                key={word.id}
                                onClick={() =>
                                    setEditingWord({
                                        id: word.id,
                                        original: word.original,
                                        translation: word.translation,
                                    })
                                }
                            >
                                {editingWord && editingWord.id === word.id ? (
                                    // Показываем редактируемое слово с полями ввода
                                    <>
                                        <td>
                                            <input
                                                type="text"
                                                value={editingWord.original}
                                                onChange={(e) =>
                                                    setEditingWord({ ...editingWord, original: e.target.value })
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={editingWord.translation}
                                                onChange={(e) =>
                                                    setEditingWord({ ...editingWord, translation: e.target.value })
                                                }
                                            />
                                        </td>
                                        <td>
                                            <button
                                                onClick={async (e) => {
                                                    e.stopPropagation() // Предотвращаем клик по строке
                                                    if (editingWord.id) {
                                                        await axios.patch(`/api/word/${editingWord.id}/updateword`, {
                                                            original: editingWord.original,
                                                            translation: editingWord.translation,
                                                        })
                                                        dispatch(fetchCollectionById(id)) // Обновляем коллекцию
                                                        setEditingWord(null) // Закрываем редактирование
                                                    }
                                                }}
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={async (e) => {
                                                    e.stopPropagation()
                                                    if (editingWord.id) {
                                                        await axios.delete(`/api/word/${editingWord.id}/delete`)
                                                        dispatch(fetchCollectionById(id))
                                                        setEditingWord(null)
                                                    }
                                                }}
                                            >
                                                Delete
                                            </button>
                                            <button onClick={() => setEditingWord(null)}>Cancel</button>
                                        </td>
                                    </>
                                ) : (
                                    // Отображаем обычные слова, если они не редактируются
                                    <>
                                        <td>{word.original}</td>
                                        <td>{word.translation}</td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ModalWindow isOpen={isModalOpen} onClose={closeModal}>
                {randomWordsStatus === 'loading' && <p>Загрузка случайных слов...</p>}
                {randomWordsStatus === 'error' && <p>Ошибка при загрузке случайных слов</p>}
                {randomWordsStatus === 'loaded' && randomWords.length > 0 && (
                    <div>
                        <p>
                            {randomWords[currentWordIndex]?.original} -{' '}
                            {!isRandomWordHidden && randomWords[currentWordIndex]?.translation}
                        </p>
                        {isRandomWordHidden && (
                            <button
                                onClick={() => {
                                    setIsRandomWordHidden(false)
                                }}
                            >
                                Show word
                            </button>
                        )}
                        {currentWordIndex > 0 && <button onClick={handlePrevWord}>Назад</button>}
                        <button
                            onClick={() => {
                                handleNextWord()
                                setIsRandomWordHidden(true)
                            }}
                        >
                            {currentWordIndex < randomWords.length - 1 ? 'Вперед' : 'Завершить'}
                        </button>
                    </div>
                )}
            </ModalWindow>
        </div>
    )
}
