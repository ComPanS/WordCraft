import React, { useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import axios from '../../../axios'
import styles from './index.module.scss'
import { type AppDispatch } from '../../../../redux/store'
import { getViewCollectionRoute } from '../../../lib/routes'

interface Collection {
    id: string
    title: string
    description?: string
    createdAt: string
    language: string
    isPublic: boolean // Добавлено новое поле
}

interface User {
    userData: {
        id: string
    }
}

export const CreateCollectionPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const user = useSelector((state: { auth: { data: User | null } }) => state.auth.data)

    const [isLoading, setIsLoading] = useState(false)

    const [fields, setFields] = useState({
        title: '',
        description: '',
        language: '',
        isPublic: true,
    })

    const isEmptyFields = Object.values({
        title: fields.title,
        description: fields.description,
        language: fields.language,
    }).some((v) => !v)

    const setFieldValue = (name: string, value: any) => {
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

    const onSubmit = async () => {
        try {
            setIsLoading(true)
            const postData = { ...fields }
            const { data } = await axios.post('/api/collections/create-collection', postData)
            navigate(getViewCollectionRoute({ id: data.id }))
        } catch (err: any) {
            console.warn('Error creating collection:', err.response?.data || err)
            alert(err.response?.data?.message || 'Ошибка при создании коллекции')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
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
            {/* Выпадающий список для выбора Public/Private */}
            <select
                value={fields.isPublic ? 'true' : 'false'}
                onChange={(e: any) => setFieldValue('isPublic', e.target.value === 'true')}
            >
                <option value="true">Public</option>
                <option value="false">Private</option>
            </select>
            <button onClick={onSubmit} disabled={isEmptyFields}>
                Create
            </button>
        </>
    )
}
