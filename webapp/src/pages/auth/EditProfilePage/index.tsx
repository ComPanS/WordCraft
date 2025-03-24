import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.scss'
import { type AppDispatch } from '../../../../redux/store'
import { getProfileRoute } from '../../../lib/routes'
import axios from '../../../axios'
import { Alert } from '../../../components/Alert'

interface User {
    userId: string
    email: string
    name: string
    avatar?: string
    updatedAt: string
    createdAt: string
}

export const EditProfilePage = () => {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const user = useSelector((state: { auth: { data: User | null } }) => state.auth.data)

    const [name, setName] = useState(user?.name || '')
    const [email, setEmail] = useState(user?.email || '')
    const [avatar, setAvatar] = useState(user?.avatar || '')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await axios.patch('/api/auth/updateProfileRoute', { name, email, avatar })
            navigate(getProfileRoute())
        } catch (err) {
            setError('Ошибка обновления профиля')
        }
    }

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newPassword || newPassword !== confirmPassword) {
            setError('Пароли не совпадают')
            return
        }
        try {
            await axios.patch('/api/auth/updatePasswordRoute', { newPassword })
            setNewPassword('')
            setConfirmPassword('')
            navigate(getProfileRoute())
        } catch (error: any) {
            if (error.isAxiosError && error.response.data.errors) {
                setError(error.response.data.errors[0]?.msg || 'Ошибка обновления пароля')
            } else {
                setError('Ошибка обновления пароля')
            }
        }
    }

    return (
        <div className={styles.editProfileContainer}>
            <h1>Редактировать профиль</h1>
            {error && <Alert color="red">{error}</Alert>}

            <form onSubmit={handleProfileUpdate} className={styles.form}>
                <label>
                    Имя:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </label>
                <label>
                    Email:
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <label>
                    Аватар (URL):
                    <input type="text" value={avatar} onChange={(e) => setAvatar(e.target.value)} />
                </label>
                <button type="submit">Сохранить изменения</button>
            </form>

            <form onSubmit={handlePasswordUpdate} className={styles.form}>
                <label>
                    Новый пароль:
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </label>
                <label>
                    Подтвердите пароль:
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </label>
                <button type="submit">Обновить пароль</button>
            </form>
        </div>
    )
}
