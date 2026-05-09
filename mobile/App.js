import 'react-native-gesture-handler'
import React, { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { AuthProvider } from './src/context/AuthContext'
import AppNavigator from './src/navigation/AppNavigator'
import {
  requestNotificationPermissions,
  schedulePetHungryNotification,
  scheduleSavingReminderNotification,
  scheduleStreakReminderNotification,
} from './src/utils/notifications'

export default function App() {
  useEffect(() => {
    const initNotifications = async () => {
      const granted = await requestNotificationPermissions()
      if (granted) {
        await schedulePetHungryNotification()
        await scheduleSavingReminderNotification()
        await scheduleStreakReminderNotification()
      }
    }
    initNotifications()
  }, [])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <StatusBar style="dark" backgroundColor="#F0F9FF" />
        <AppNavigator />
      </AuthProvider>
    </GestureHandlerRootView>
  )
}
