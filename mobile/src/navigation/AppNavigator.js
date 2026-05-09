import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { Text, View } from 'react-native'
import { Colors } from '../utils/theme'

import LoginScreen from '../screens/LoginScreen'
import RegisterScreen from '../screens/RegisterScreen'
import DashboardScreen from '../screens/DashboardScreen'
import GoalsScreen from '../screens/GoalsScreen'
import PetScreen from '../screens/PetScreen'
import { useAuth } from '../context/AuthContext'

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()
const GoalsStack = createStackNavigator()

const TAB_ICONS = {
  Dashboard: '🏠',
  Goals: '🎯',
  Pet: '🐾',
  Challenges: '⚡',
  Profile: '👤',
}

function GoalsStackNav() {
  return (
    <GoalsStack.Navigator screenOptions={{ headerShown: false }}>
      <GoalsStack.Screen name="GoalsList" component={GoalsScreen} />
    </GoalsStack.Navigator>
  )
}

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: focused ? 26 : 22 }}>{TAB_ICONS[route.name]}</Text>
          </View>
        ),
        tabBarLabel: ({ focused }) => (
          <Text style={{
            fontSize: 10,
            fontWeight: '700',
            color: focused ? Colors.primary : Colors.gray400,
            marginTop: -4,
          }}>
            {route.name}
          </Text>
        ),
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#E0F2FE',
          paddingTop: 8,
          paddingBottom: 8,
          height: 65,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray400,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Goals" component={GoalsStackNav} />
      <Tab.Screen name="Pet" component={PetScreen} />
    </Tab.Navigator>
  )
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  )
}

export default function AppNavigator() {
  const { user, loading } = useAuth()

  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
      <Text style={{ fontSize: 56 }}>🫙</Text>
    </View>
  )

  return (
    <NavigationContainer>
      {user ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
  )
}
