import axios from 'axios'
import { sharedEnv } from '@wordcraft/shared/src/env'

const instance = axios.create({
    baseURL: sharedEnv.BACKEND_URL,
    withCredentials: true,
})

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default instance
