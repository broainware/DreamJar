import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

export const requestNotificationPermissions = async () => {
  const { status } = await Notifications.requestPermissionsAsync()
  return status === 'granted'
}

export const schedulePetHungryNotification = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync()
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🐾 Your pet is hungry!',
      body: 'Feed your pet to keep it happy. Save money to earn food coins!',
      data: { screen: 'Pet' },
    },
    trigger: { seconds: 60 * 60 * 8, repeats: true }, // every 8 hours
  })
}

export const scheduleSavingReminderNotification = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '💰 Save today to earn coins!',
      body: 'Your pet is waiting for you. Add your daily saving!',
      data: { screen: 'Goals' },
    },
    trigger: {
      hour: 20, minute: 0, repeats: true,
    },
  })
}

export const scheduleStreakReminderNotification = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🔥 Keep your streak alive!',
      body: 'Log in today to maintain your saving streak!',
      data: { screen: 'Dashboard' },
    },
    trigger: {
      hour: 9, minute: 0, repeats: true,
    },
  })
}

export const sendInstantNotification = async (title, body) => {
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: null,
  })
}
