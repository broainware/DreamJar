import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const API_URL = 'http://localhost:5000/api' // Change to your server IP for device testing

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('dreamjar_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  async err => {
    if (err.response?.status === 401) {
      await AsyncStorage.removeItem('dreamjar_token')
      await AsyncStorage.removeItem('dreamjar_user')
    }
    return Promise.reject(err)
  }
)

export default api
