import axios from 'axios'
import { sharedEnv } from '@wordcraft/shared/src/env'

const instance = axios.create({
    baseURL: sharedEnv.WEBAPP_URL,
    withCredentials: true,
})

instance.interceptors.response.use((config) => {
    config.headers.Authorization = localStorage.getItem('token')
    return config
})

export default instance
