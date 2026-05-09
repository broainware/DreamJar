import React, { useEffect, useState, useRef } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Animated, Alert, ActivityIndicator, RefreshControl
} from 'react-native'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import { getPetEmoji, getPetTypeEmoji } from '../utils/helpers'
import { Colors, Radius, Shadow } from '../utils/theme'

const PET_TYPES = ['cat', 'bunny', 'hamster', 'panda', 'dinosaur']

export default function PetScreen() {
  const { user, refreshUser } = useAuth()
  const [pet, setPet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [acting, setActing] = useState(false)
  const [setupMode, setSetupMode] = useState(false)
  const [setupForm, setSetupForm] = useState({ name: 'Buddy', type: 'cat' })
  const [activeTab, setActiveTab] = useState('pet')
  const bounceAnim = useRef(new Animated.Value(0)).current

  const fetchPet = async () => {
    try {
      const res = await api.get('/pets')
      setPet(res.data.pet)
    } catch { setPet(null) }
    finally { setLoading(false); setRefreshing(false) }
  }

  useEffect(() => { fetchPet() }, [])

  const animatePet = () => {
    Animated.sequence([
      Animated.timing(bounceAnim, { toValue: -20, duration: 200, useNativeDriver: true }),
      Animated.timing(bounceAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(bounceAnim, { toValue: -10, duration: 150, useNativeDriver: true }),
      Animated.timing(bounceAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
    ]).start()
  }

  const doAction = async (endpoint, successMsg) => {
    setActing(true)
    animatePet()
    try {
      const res = await api.post(`/pets/${endpoint}`)
      Alert.alert('', res.data.message || successMsg)
      fetchPet()
      refreshUser()
    } catch (err) {
      Alert.alert('Oops!', err.response?.data?.message || 'Action failed')
    } finally {
      setActing(false)
    }
  }

  const handleSetup = async () => {
    if (!setupForm.name.trim()) { Alert.alert('Error', 'Please enter a name'); return }
    try {
      await api.post('/pets/setup', setupForm)
      setSetupMode(false)
      fetchPet()
    } catch { Alert.alert('Error', 'Failed to setup pet') }
  }

  if (loading) {
    return (
      <View style={styles.loader}>
        <Text style={styles.loaderEmoji}>🐾</Text>
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 12 }} />
      </View>
    )
  }

  if (setupMode || !pet) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.setupContent}>
        <Text style={styles.setupTitle}>Choose Your Pet! 🐾</Text>
        <Text style={styles.setupSub}>Your companion on your saving journey</Text>

        <View style={styles.petTypesGrid}>
          {PET_TYPES.map(type => (
            <TouchableOpacity
              key={type}
              style={[styles.petTypeBtn, setupForm.type === type && styles.petTypeBtnActive]}
              onPress={() => setSetupForm({ ...setupForm, type })}
            >
              <Text style={styles.petTypeEmoji}>{getPetTypeEmoji(type)}</Text>
              <Text style={styles.petTypeLabel}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.selectedPet}>{getPetTypeEmoji(setupForm.type)}</Text>
        <Text style={styles.selectedPetName}>{setupForm.name}</Text>

        <Text style={styles.label}>Pet Name</Text>
        <View style={styles.nameRow}>
          {['Buddy', 'Mochi', 'Coco', 'Pudding', 'Boba'].map(n => (
            <TouchableOpacity
              key={n}
              style={[styles.nameChip, setupForm.name === n && styles.nameChipActive]}
              onPress={() => setSetupForm({ ...setupForm, name: n })}
            >
              <Text style={[styles.nameChipText, setupForm.name === n && styles.nameChipTextActive]}>{n}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.bigBtn} onPress={handleSetup}>
          <Text style={styles.bigBtnText}>🚀 Let's Go!</Text>
        </TouchableOpacity>
      </ScrollView>
    )
  }

  const petEmoji = getPetEmoji(pet.type, pet.mood)

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchPet() }} tintColor={Colors.primary} />}
    >
      <View style={styles.content}>
        {/* Tabs */}
        <View style={styles.tabs}>
          {['pet', 'shop'].map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.tab, activeTab === t && styles.tabActive]}
              onPress={() => setActiveTab(t)}
            >
              <Text style={[styles.tabText, activeTab === t && styles.tabTextActive]}>
                {t === 'pet' ? '🐾 My Pet' : '🛍️ Shop'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'pet' ? (
          <>
            {/* Pet Display */}
            <View style={styles.petDisplay}>
              <Animated.Text style={[styles.petBig, { transform: [{ translateY: bounceAnim }] }]}>
                {petEmoji}
              </Animated.Text>
              <Text style={styles.petNameDisplay}>{pet.name}</Text>
              <View style={styles.petBadgeRow}>
                <View style={styles.petBadge}>
                  <Text style={styles.petBadgeText}>Lv.{pet.level} {pet.type}</Text>
                </View>
                <View style={[styles.petBadge, { backgroundColor: Colors.mintLight }]}>
                  <Text style={[styles.petBadgeText, { color: Colors.mint }]}>{pet.mood}</Text>
                </View>
              </View>

              {/* Stats */}
              {[
                { label: '🍖 Hunger', value: pet.hunger, color: Colors.lemon },
                { label: '😊 Happiness', value: pet.happiness, color: Colors.mint },
                { label: '⚡ Energy', value: pet.energy, color: Colors.primary },
              ].map(s => (
                <View key={s.label} style={styles.statRow}>
                  <Text style={styles.statLabel}>{s.label}</Text>
                  <View style={styles.statBarBg}>
                    <View style={[styles.statBarFill, { width: `${s.value}%`, backgroundColor: s.color }]} />
                  </View>
                  <Text style={styles.statVal}>{s.value}%</Text>
                </View>
              ))}
            </View>

            {/* Actions */}
            <View style={styles.actionsGrid}>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: '#FEF3C7' }]}
                onPress={() => doAction('feed', 'Pet fed!')}
                disabled={acting}
              >
                <Text style={styles.actionEmoji}>🍖</Text>
                <Text style={styles.actionLabel}>Feed</Text>
                <Text style={styles.actionCost}>10 🪙</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: Colors.mintLight }]}
                onPress={() => doAction('play', 'Played!')}
                disabled={acting}
              >
                <Text style={styles.actionEmoji}>🎾</Text>
                <Text style={styles.actionLabel}>Play</Text>
                <Text style={styles.actionCost}>Free!</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: Colors.lavenderLight }]}
                onPress={() => doAction('sleep', 'Pet sleeping!')}
                disabled={acting}
              >
                <Text style={styles.actionEmoji}>💤</Text>
                <Text style={styles.actionLabel}>Sleep</Text>
                <Text style={styles.actionCost}>Recharge</Text>
              </TouchableOpacity>
            </View>

            {/* Coins */}
            <View style={styles.coinsRow}>
              <Text style={styles.coinsLabel}>Your coins:</Text>
              <Text style={styles.coinsValue}>🪙 {user?.coins || 0}</Text>
            </View>

            <TouchableOpacity style={styles.changeBtn} onPress={() => setSetupMode(true)}>
              <Text style={styles.changeBtnText}>🔄 Change Pet</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.shopGrid}>
            {[
              { emoji: '🎩', name: 'Party Hat', cost: 50 },
              { emoji: '🕶️', name: 'Sunglasses', cost: 40 },
              { emoji: '🎀', name: 'Bow Tie', cost: 30 },
              { emoji: '⚽', name: 'Toy Ball', cost: 20 },
              { emoji: '👑', name: 'Crown', cost: 100 },
              { emoji: '🛏️', name: 'Cozy Bed', cost: 80 },
            ].map(item => (
              <View key={item.name} style={styles.shopItem}>
                <Text style={styles.shopEmoji}>{item.emoji}</Text>
                <Text style={styles.shopName}>{item.name}</Text>
                <View style={styles.shopCostRow}>
                  <Text style={styles.shopCost}>🪙 {item.cost}</Text>
                </View>
                <TouchableOpacity style={styles.shopBtn}>
                  <Text style={styles.shopBtnText}>Buy</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 32 },
  loader: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' },
  loaderEmoji: { fontSize: 48 },
  setupContent: { padding: 24, alignItems: 'center' },
  setupTitle: { fontSize: 28, fontWeight: '800', color: Colors.gray800, marginBottom: 8 },
  setupSub: { fontSize: 14, color: Colors.gray500, fontWeight: '500', marginBottom: 24 },
  petTypesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 24 },
  petTypeBtn: {
    width: 80, alignItems: 'center', padding: 12, borderRadius: Radius.lg,
    borderWidth: 2, borderColor: Colors.gray200, backgroundColor: Colors.white,
  },
  petTypeBtnActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  petTypeEmoji: { fontSize: 28, marginBottom: 4 },
  petTypeLabel: { fontSize: 11, fontWeight: '700', color: Colors.gray600, textTransform: 'capitalize' },
  selectedPet: { fontSize: 80, marginBottom: 4 },
  selectedPetName: { fontSize: 20, fontWeight: '800', color: Colors.primary, marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '700', color: Colors.gray500, marginBottom: 8, alignSelf: 'flex-start' },
  nameRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 28 },
  nameChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.full, backgroundColor: Colors.primaryLight },
  nameChipActive: { backgroundColor: Colors.primary },
  nameChipText: { fontSize: 13, fontWeight: '700', color: Colors.primary },
  nameChipTextActive: { color: Colors.white },
  bigBtn: { backgroundColor: Colors.primary, borderRadius: Radius.lg, paddingVertical: 14, paddingHorizontal: 48 },
  bigBtnText: { color: Colors.white, fontSize: 16, fontWeight: '800' },
  tabs: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: Radius.lg, backgroundColor: Colors.white, alignItems: 'center' },
  tabActive: { backgroundColor: Colors.primary },
  tabText: { fontSize: 13, fontWeight: '700', color: Colors.gray500 },
  tabTextActive: { color: Colors.white },
  petDisplay: {
    backgroundColor: Colors.white, borderRadius: Radius.xl, padding: 20,
    alignItems: 'center', marginBottom: 16, ...Shadow.card,
  },
  petBig: { fontSize: 80, marginBottom: 8 },
  petNameDisplay: { fontSize: 22, fontWeight: '800', color: Colors.primary, marginBottom: 8 },
  petBadgeRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  petBadge: { backgroundColor: Colors.lavenderLight, borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 4 },
  petBadgeText: { fontSize: 12, fontWeight: '700', color: Colors.lavender, textTransform: 'capitalize' },
  statRow: { flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 8, gap: 8 },
  statLabel: { fontSize: 12, fontWeight: '700', color: Colors.gray500, width: 90 },
  statBarBg: { flex: 1, height: 8, backgroundColor: Colors.gray100, borderRadius: 4, overflow: 'hidden' },
  statBarFill: { height: 8, borderRadius: 4 },
  statVal: { fontSize: 11, fontWeight: '700', color: Colors.gray400, width: 32, textAlign: 'right' },
  actionsGrid: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  actionBtn: { flex: 1, borderRadius: Radius.xl, padding: 16, alignItems: 'center' },
  actionEmoji: { fontSize: 32, marginBottom: 4 },
  actionLabel: { fontSize: 13, fontWeight: '800', color: Colors.gray700 },
  actionCost: { fontSize: 10, color: Colors.gray500, fontWeight: '600', marginTop: 2 },
  coinsRow: {
    backgroundColor: Colors.lemonLight, borderRadius: Radius.lg, padding: 12,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12,
  },
  coinsLabel: { fontSize: 13, fontWeight: '700', color: Colors.gray600 },
  coinsValue: { fontSize: 16, fontWeight: '800', color: Colors.lemon },
  changeBtn: {
    borderWidth: 2, borderColor: Colors.gray200, borderRadius: Radius.lg,
    paddingVertical: 12, alignItems: 'center',
  },
  changeBtnText: { fontSize: 14, fontWeight: '700', color: Colors.gray500 },
  shopGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  shopItem: {
    width: '47%', backgroundColor: Colors.white, borderRadius: Radius.xl,
    padding: 16, alignItems: 'center', ...Shadow.card,
  },
  shopEmoji: { fontSize: 40, marginBottom: 8 },
  shopName: { fontSize: 13, fontWeight: '700', color: Colors.gray700, marginBottom: 6 },
  shopCostRow: { backgroundColor: Colors.lemonLight, borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 3, marginBottom: 10 },
  shopCost: { fontSize: 12, fontWeight: '800', color: Colors.lemon },
  shopBtn: { backgroundColor: Colors.primary, borderRadius: Radius.lg, paddingHorizontal: 20, paddingVertical: 8 },
  shopBtnText: { color: Colors.white, fontSize: 13, fontWeight: '800' },
})
