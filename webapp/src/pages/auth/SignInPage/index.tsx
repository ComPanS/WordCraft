import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from '../../../axios'
import { useForm } from 'react-hook-form'
import { Alert } from '../../../components/Alert'

import styles from './Login.module.scss'
import { setUserData } from '../../../../redux/slices/auth'

export const SignInPage = () => {
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
            const { data } = await axios.post('/api/auth/sign-in', fields)
            dispatch(setUserData(data))
            window.localStorage.setItem('token', data.token)
            navigate('/')
        } catch (error: any) {
            if (error.isAxiosError) {
                if (error.response.data.errors) {
                    error.response.data.errors.forEach((obj: any) => {
                        {
                            setError(
                                obj.param,
                                {
                                    message: obj.msg,
                                },
                                { shouldFocus: true }
                            )
                        }
                    })
                }
                if (error.response.data.message) {
                    setError('password', { message: error.response.data.message }, { shouldFocus: true })
                }
            }
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    type="email"
                    placeholder="Email"
                    autoComplete="off"
                    {...register('email', {
                        required: 'Specify email',
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
                    autoComplete="off"
                    {...register('password', {
                        required: 'Specify password',
                        minLength: {
                            value: 5,
                            message: 'Minimum 5 characters',
                        },
                    })}
                />
                {errors.password && (
                    <Alert color="red">
                        <>{errors.password.message}</>
                    </Alert>
                )}

                <input type="submit" value="LogIn" disabled={!isValid} />
            </form>
        </>
    )
}
