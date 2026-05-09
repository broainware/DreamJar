import React, { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native'
import { useAuth } from '../context/AuthContext'
import { Colors, Radius, Shadow } from '../utils/theme'

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) {
      Alert.alert('Error', 'Please fill all fields'); return
    }
    if (form.password !== form.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match'); return
    }
    if (form.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters'); return
    }
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
    } catch (err) {
      Alert.alert('Registration Failed', err.response?.data?.message || 'Please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.logo}>🌟</Text>
          <Text style={styles.appName}>Join DreamJar</Text>
          <Text style={styles.tagline}>Start your saving journey today 🚀</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Create Account 🎊</Text>

          {[
            { key: 'name', label: '👤 Full Name', placeholder: 'Your awesome name', type: 'default' },
            { key: 'email', label: '📧 Email', placeholder: 'hello@dreamjar.app', type: 'email-address' },
            { key: 'password', label: '🔒 Password', placeholder: 'Min. 6 characters', secure: true },
            { key: 'confirmPassword', label: '🔒 Confirm Password', placeholder: 'Repeat password', secure: true },
          ].map((f) => (
            <View key={f.key} style={styles.field}>
              <Text style={styles.label}>{f.label}</Text>
              <TextInput
                style={styles.input}
                placeholder={f.placeholder}
                placeholderTextColor={Colors.gray400}
                value={form[f.key]}
                onChangeText={(v) => setForm({ ...form, [f.key]: v })}
                keyboardType={f.type || 'default'}
                autoCapitalize={f.key === 'name' ? 'words' : 'none'}
                secureTextEntry={f.secure || false}
              />
            </View>
          ))}

          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>✨ Create Account</Text>}
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Login 👈</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.petInfo}>
          <Text style={styles.petInfoText}>🐾 A cute virtual pet is waiting for you!</Text>
          <Text style={styles.petInfoSub}>Choose from 5 adorable companions</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flexGrow: 1, padding: 24 },
  header: { alignItems: 'center', marginBottom: 24, marginTop: 20 },
  logo: { fontSize: 56, marginBottom: 8 },
  appName: { fontSize: 30, fontWeight: '800', color: Colors.primary },
  tagline: { fontSize: 14, color: Colors.gray500, marginTop: 4, fontWeight: '500' },
  card: { backgroundColor: Colors.white, borderRadius: Radius.xl, padding: 24, ...Shadow.card, marginBottom: 16 },
  cardTitle: { fontSize: 22, fontWeight: '800', color: Colors.gray800, marginBottom: 20, textAlign: 'center' },
  field: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '700', color: Colors.gray500, marginBottom: 6 },
  input: {
    borderWidth: 2, borderColor: Colors.gray200, borderRadius: Radius.lg,
    paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, color: Colors.gray800, fontWeight: '500',
  },
  btn: {
    backgroundColor: Colors.primary, borderRadius: Radius.lg,
    paddingVertical: 14, alignItems: 'center', marginTop: 8, marginBottom: 16,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: Colors.white, fontSize: 16, fontWeight: '800' },
  loginRow: { flexDirection: 'row', justifyContent: 'center' },
  loginText: { fontSize: 14, color: Colors.gray500, fontWeight: '500' },
  loginLink: { fontSize: 14, color: Colors.primary, fontWeight: '800' },
  petInfo: {
    backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: Radius.lg,
    padding: 16, alignItems: 'center',
  },
  petInfoText: { fontSize: 14, fontWeight: '700', color: Colors.gray700 },
  petInfoSub: { fontSize: 12, color: Colors.primary, fontWeight: '600', marginTop: 4 },
})
