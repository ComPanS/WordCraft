import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from '../../../axios'
import { useForm } from 'react-hook-form'
import { Alert } from '../../../components/Alert'

import styles from './index.module.scss'
import { setUserData } from '../../../../redux/slices/auth'

export const SignUpPage = () => {
    const [isLogin, setIsLogin] = useState(true)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        setError,
        watch,
        formState: { errors, isValid },
    } = useForm({
        mode: 'onChange',
    })

    const onSubmit = async (fields: any) => {
        try {
            const { data } = await axios.post('api/auth/sign-in', fields)
            dispatch(setUserData(data))
            window.localStorage.setItem('token', data.token)
            navigate('/')
        } catch (error: any) {
            if (error.isAxiosError) {
                if (error.response.data.errors) {
                    error.response.data.errors.forEach((obj: any) => {
                        setError(
                            obj.param,
                            {
                                message: obj.msg,
                            },
                            { shouldFocus: true }
                        )
                    })
                }
                if (error.response.data.message) {
                    setError('password', { message: error.response.data.message }, { shouldFocus: true })
                }
            }
        }
    }

    const onRegister = async (fields: any) => {
        try {
            const { data } = await axios.post('api/auth/sign-up', fields)
            dispatch(setUserData(data))
            window.localStorage.setItem('token', data.token)
            navigate('/')
        } catch (error: any) {
            if (error.response?.data?.message) {
                setError('email', {
                    type: 'manual',
                    message: error.response.data.message,
                })
            }
        }
    }
    return (
        <form onSubmit={handleSubmit(onRegister)} autoComplete="off" key="register">
            <input
                type="text"
                placeholder="Name"
                autoComplete="off"
                {...register('name', {
                    required: 'Укажите имя пользователя',
                    minLength: {
                        value: 3,
                        message: 'Имя должно быть не менее 3 символов',
                    },
                })}
            />
            {errors.name && (
                <Alert color="red">
                    <>{errors.name.message}</>
                </Alert>
            )}

            <input
                type="email"
                placeholder="Email"
                autoComplete="off"
                {...register('email', {
                    required: 'Укажите почту',
                    pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email',
                    },
                })}
            />
            {errors.email && (
                <Alert color="red">
                    <>{errors.email.message}</>
                </Alert>
            )}

            <input
                type="password"
                placeholder="Password"
                {...register('password', {
                    required: 'Укажите пароль',
                    minLength: {
                        value: 6,
                        message: 'Minimum 6 charaters',
                    },
                })}
            />
            {errors.password && (
                <Alert color="red">
                    <>{errors.password.message}</>
                </Alert>
            )}

            <input
                type="password"
                placeholder="Password again"
                {...register('password2', {
                    required: 'Подтвердите пароль',
                    validate: (val) => {
                        if (watch('password') != val) {
                            return 'Passwords are not same'
                        }
                    },
                })}
            />
            {errors.password2 && <span className={styles.error}></span>}

            <input type="submit" value="Reg" disabled={!isValid} />
        </form>
    )
}
