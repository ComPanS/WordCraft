import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOwnCollections } from '../../../../redux/slices/collections'
import { type AppDispatch } from '../../../../redux/store'
import { Link } from 'react-router-dom'
import styles from './index.module.scss'
import { getViewCollectionRoute } from '../../../lib/routes'

export const OwnCollectionsPage = () => {
    const { ownCollections, ownCollectionsStatus } = useSelector(
        (state: { collections: { ownCollections: any; ownCollectionsStatus: any } }) => state.collections
    )
    const postsLoading = ownCollectionsStatus === 'loading'
    const dispatch = useDispatch<AppDispatch>()
    const [sortBy, setSortBy] = useState<'date' | 'title' | 'likes'>('date') // Добавлен вариант 'likes'
    const [searchQuery, setSearchQuery] = useState('') // Состояние для хранения поискового запроса
    const [filteredCollections, setFilteredCollections] = useState(ownCollections) // Состояние для хранения отфильтрованных коллекций

    React.useEffect(() => {
        dispatch(fetchOwnCollections())
    }, [dispatch])

    // Эффект для фильтрации коллекций с задержкой
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            const filtered = ownCollections.filter((collection: any) =>
                collection.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
            setFilteredCollections(filtered)
        }, 1000) // Задержка в 1 секунду

        return () => clearTimeout(delayDebounceFn)
    }, [searchQuery, ownCollections])

    const truncateDescription = (text: string, maxLength: number = 100) => {
        if (text.length > maxLength) {
            return text.slice(0, maxLength) + '...'
        }
        return text
    }

    // Метод для сортировки по дате
    const sortByDate = (a: any, b: any) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }

    // Метод для сортировки по названию
    const sortByTitle = (a: any, b: any) => {
        return a.title.localeCompare(b.title)
    }

    // Метод для сортировки по лайкам
    const sortByLikes = (a: any, b: any) => {
        return b.likesCount - a.likesCount // Сортировка по убыванию (от большего к меньшему)
    }

    // Сортируем коллекции в зависимости от выбранного типа сортировки
    const sortedCollections = [...filteredCollections].sort(
        sortBy === 'date' ? sortByDate : sortBy === 'title' ? sortByTitle : sortByLikes
    )

    if (postsLoading) {
        return null
    }

    return (
        <div className={styles.all_collections}>
            <div className={styles.search_bar}>
                <input
                    type="text"
                    placeholder="Search collections..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className={styles.sort_controls}>
                <label htmlFor="sort-by">Sort by:</label>
                <select
                    id="sort-by"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'likes')}
                >
                    <option value="date">Date</option>
                    <option value="title">Title</option>
                    <option value="likes">Likes</option> {/* Добавлен новый вариант */}
                </select>
            </div>
            {sortedCollections.length === 0 && searchQuery ? (
                <div className={styles.no_results}>Nothing was found for your query.</div>
            ) : (
                sortedCollections.map((obj: any, index: any) => (
                    <div className={styles.collection} key={index}>
                        <h2>
                            <Link to={getViewCollectionRoute({ id: obj.id })}>{obj.title}</Link>
                        </h2>
                        <p>{truncateDescription(obj.description)}</p>
                        <p>Likes: {obj.likesCount}</p> {/* Отображение количества лайков */}
                    </div>
                ))
            )}
        </div>
    )
}
