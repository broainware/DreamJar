import React, { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native'
import { useAuth } from '../context/AuthContext'
import { Colors, Radius, Shadow } from '../utils/theme'

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleLogin = async () => {
    if (!email || !password) { Alert.alert('Error', 'Please fill all fields'); return }
    setLoading(true)
    try {
      await login(email, password)
    } catch (err) {
      Alert.alert('Login Failed', err.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>🫙</Text>
          <Text style={styles.appName}>DreamJar</Text>
          <Text style={styles.tagline}>Save your dreams, one coin at a time ✨</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome Back! 👋</Text>

          <View style={styles.field}>
            <Text style={styles.label}>📧 Email</Text>
            <TextInput
              style={styles.input}
              placeholder="hello@dreamjar.app"
              placeholderTextColor={Colors.gray400}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>🔒 Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={Colors.gray400}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>🚀 Login</Text>}
          </TouchableOpacity>

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Register 🌟</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Features */}
        <View style={styles.features}>
          {[['🎯', 'Set Goals'], ['🐾', 'Virtual Pet'], ['🏆', 'Earn Rewards']].map(([emoji, text]) => (
            <View key={text} style={styles.featureItem}>
              <Text style={styles.featureEmoji}>{emoji}</Text>
              <Text style={styles.featureText}>{text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 28 },
  logo: { fontSize: 64, marginBottom: 8 },
  appName: { fontSize: 36, fontWeight: '800', color: Colors.primary, letterSpacing: 0.5 },
  tagline: { fontSize: 14, color: Colors.gray500, marginTop: 4, fontWeight: '500' },
  card: {
    backgroundColor: Colors.white, borderRadius: Radius.xl, padding: 24,
    ...Shadow.card, marginBottom: 16,
  },
  cardTitle: { fontSize: 22, fontWeight: '800', color: Colors.gray800, marginBottom: 20, textAlign: 'center' },
  field: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '700', color: Colors.gray500, marginBottom: 6 },
  input: {
    borderWidth: 2, borderColor: Colors.gray200, borderRadius: Radius.lg,
    paddingHorizontal: 16, paddingVertical: 12, fontSize: 15,
    color: Colors.gray800, backgroundColor: Colors.white, fontWeight: '500',
  },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: 20 },
  forgotText: { fontSize: 13, color: Colors.primary, fontWeight: '700' },
  btn: {
    backgroundColor: Colors.primary, borderRadius: Radius.lg,
    paddingVertical: 14, alignItems: 'center', marginBottom: 16,
    ...Shadow.card,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: Colors.white, fontSize: 16, fontWeight: '800' },
  registerRow: { flexDirection: 'row', justifyContent: 'center' },
  registerText: { fontSize: 14, color: Colors.gray500, fontWeight: '500' },
  registerLink: { fontSize: 14, color: Colors.primary, fontWeight: '800' },
  features: { flexDirection: 'row', gap: 8 },
  featureItem: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: Radius.lg,
    padding: 12, alignItems: 'center',
  },
  featureEmoji: { fontSize: 24, marginBottom: 4 },
  featureText: { fontSize: 11, fontWeight: '700', color: Colors.gray500 },
})
