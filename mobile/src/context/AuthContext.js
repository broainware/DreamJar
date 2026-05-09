import React, { createContext, useContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '../utils/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      try {
        const token = await AsyncStorage.getItem('dreamjar_token')
        const savedUser = await AsyncStorage.getItem('dreamjar_user')
        if (token && savedUser) {
          setUser(JSON.parse(savedUser))
          const res = await api.get('/auth/me')
          setUser(res.data.user)
          await AsyncStorage.setItem('dreamjar_user', JSON.stringify(res.data.user))
        }
      } catch {
        await AsyncStorage.removeItem('dreamjar_token')
        await AsyncStorage.removeItem('dreamjar_user')
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    await AsyncStorage.setItem('dreamjar_token', res.data.token)
    await AsyncStorage.setItem('dreamjar_user', JSON.stringify(res.data.user))
    setUser(res.data.user)
    return res.data
  }

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password })
    await AsyncStorage.setItem('dreamjar_token', res.data.token)
    await AsyncStorage.setItem('dreamjar_user', JSON.stringify(res.data.user))
    setUser(res.data.user)
    return res.data
  }

  const logout = async () => {
    await AsyncStorage.removeItem('dreamjar_token')
    await AsyncStorage.removeItem('dreamjar_user')
    setUser(null)
  }

  const refreshUser = async () => {
    const res = await api.get('/auth/me')
    setUser(res.data.user)
    await AsyncStorage.setItem('dreamjar_user', JSON.stringify(res.data.user))
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
