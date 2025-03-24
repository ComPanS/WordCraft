import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import styles from './index.module.scss'
import { type AppDispatch } from '../../../../redux/store'
import { getEditProfileRoute } from '../../../lib/routes'

interface User {
    userId: string
    email: string
    name: string
    avatar?: string
    updatedAt: string
    createdAt: string
}

export const ProfilePage = () => {
    const dispatch = useDispatch<AppDispatch>()
    const user = useSelector((state: { auth: { data: User | null } }) => state.auth.data)

    // useEffect(() => {
    //     dispatch(fetchUserInfo())
    // }, [dispatch])

    // if (isLoading) {
    //     return <div className={styles.loader}>Загрузка...</div>
    // }

    if (!user) {
        return <div className={styles.error}>Ошибка загрузки профиля</div>
    }

    return (
        <div className={styles.profileContainer}>
            <div className={styles.profileHeader}>
                <img src={user.avatar || ''} alt="Avatar" className={styles.avatar} />
                <h1 className={styles.name}>{user.name}</h1>
            </div>
            <div className={styles.profileDetails}>
                <p>
                    <strong>Email:</strong> {user.email}
                </p>
                <p>
                    <strong>Дата регистрации:</strong> {new Date(user.createdAt).toLocaleDateString()}
                </p>
                <p>
                    <strong>Дата последнего обновления профиля:</strong> {new Date(user.updatedAt).toLocaleDateString()}
                </p>
            </div>
            <div className={styles.profileActions}>
                <Link to={getEditProfileRoute()} className={styles.editButton}>
                    Редактировать профиль
                </Link>
            </div>
        </div>
    )
}
