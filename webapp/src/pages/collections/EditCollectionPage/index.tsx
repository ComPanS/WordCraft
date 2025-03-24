import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import axios from '../../../axios'
import styles from './index.module.scss'
import { type AppDispatch } from '../../../../redux/store'
import { title } from 'process'
import { getViewCollectionRoute } from '../../../lib/routes'

interface Collection {
    id: string
    title: string
    description?: string
    createdAt: string
    language: string
    author: {
        id: string
    }
}

interface User {
    userId: string
}

export const EditCollectionPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const { currentCollection, currentCollectionStatus } = useSelector(
        (state: { collections: { currentCollection: Collection | null; currentCollectionStatus: string } }) =>
            state.collections
    )
    const user = useSelector((state: { auth: { data: User | null } }) => state.auth.data)
    const { id } = useParams<{ id: string }>()

    const [isLoading, setIsLoading] = useState(false)

    const [fields, setFields] = useState({
        title: '',
        description: '',
        language: '',
    })

    const isEmptyFields = Object.values({
        title: fields.title,
        description: fields.description,
        language: fields.language,
    }).some((v) => !v)

    const setFieldValue = (name: any, value: any) => {
        setFields((prev) => ({ ...prev, [name]: value }))
    }

    const onChange = useCallback((e: any) => {
        const value = e.target ? e.target.value : e
        setFieldValue('text', value)
    }, [])

    const options = useMemo(
        () => ({
            spellChecker: false,
            maxHeight: '400px',
            autofocus: true,
            placeholder: 'Введите текст...',
            status: false,
            autosave: {
                enabled: true,
                delay: 1000,
            },
        }),
        []
    )

    if (currentCollectionStatus === 'loading') {
        return <div>Загрузка...</div> // Индикатор загрузки
    }

    if (currentCollectionStatus === 'error' || !currentCollection || !id) {
        return <p>Коллекция не найдена</p> // Если коллекция не найдена
    }

    const onSubmit = async () => {
        try {
            setIsLoading(true)
            const apiMethod = axios.patch.bind(this, `api/collections/${id}`)
            const postData = { ...fields }
            await apiMethod(postData)
            // console.info('Response:', data)
            navigate(getViewCollectionRoute({ id }))
        } catch (err: any) {
            console.warn('Error saving post:', err.response?.data || err)
            alert(err.response?.data?.message || 'Ошибка при сохранении коллекции')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (currentCollection) {
            setFields({
                title: currentCollection.title,
                description: currentCollection.description || '',
                language: currentCollection.language,
            })
        }
    }, [currentCollection])

    return (
        <>
            {currentCollection.author.id === user?.userId && <p>author</p>}
            <input
                type="text"
                value={fields.title}
                onChange={(e: any) => setFieldValue('title', e.target.value)}
                placeholder="Title..."
            />
            <textarea
                value={fields.description}
                onChange={(e: any) => setFieldValue('description', e.target.value)}
                placeholder="Description..."
            />
            <input
                type="text"
                value={fields.language}
                onChange={(e: any) => setFieldValue('language', e.target.value)}
                placeholder="Language..."
            />
            <button onClick={onSubmit} disabled={isEmptyFields}>
                Update
            </button>
        </>
    )
}
