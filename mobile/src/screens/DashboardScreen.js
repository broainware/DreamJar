import React, { useEffect, useState, useCallback } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  RefreshControl, ActivityIndicator
} from 'react-native'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import { formatRupiah, calcProgress, daysLeft, getCategoryEmoji, getPetEmoji } from '../utils/helpers'
import { Colors, Radius, Shadow } from '../utils/theme'

export default function DashboardScreen({ navigation }) {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchData = async () => {
    try {
      const res = await api.get('/dashboard')
      setData(res.data)
    } catch {}
    finally { setLoading(false); setRefreshing(false) }
  }

  useEffect(() => { fetchData() }, [])
  const onRefresh = useCallback(() => { setRefreshing(true); fetchData() }, [])

  if (loading) {
    return (
      <View style={styles.loader}>
        <Text style={styles.loaderEmoji}>🫙</Text>
        <Text style={styles.loaderText}>Loading...</Text>
      </View>
    )
  }

  const { stats, active_goals, pet } = data || {}

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
    >
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good day, {user?.name?.split(' ')[0]}! 👋</Text>
            <Text style={styles.date}>
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
            </Text>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <Text style={styles.streakNum}>{user?.streak || 0}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { emoji: '🎯', label: 'Active', value: stats?.active_goals || 0, bg: Colors.primaryLight },
            { emoji: '✅', label: 'Done', value: stats?.completed_goals || 0, bg: Colors.mintLight },
            { emoji: '🪙', label: 'Coins', value: user?.coins || 0, bg: Colors.lemonLight },
          ].map(s => (
            <View key={s.label} style={[styles.statCard, { backgroundColor: s.bg }]}>
              <Text style={styles.statEmoji}>{s.emoji}</Text>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Total saved */}
        <View style={styles.totalSaved}>
          <Text style={styles.totalLabel}>💰 Total Saved</Text>
          <Text style={styles.totalAmount}>{formatRupiah(stats?.total_saved || 0)}</Text>
        </View>

        {/* Pet Widget */}
        {pet && (
          <TouchableOpacity style={styles.petWidget} onPress={() => navigation.navigate('Pet')}>
            <View style={styles.petLeft}>
              <Text style={styles.petEmoji}>{getPetEmoji(pet.type, pet.mood)}</Text>
            </View>
            <View style={styles.petRight}>
              <Text style={styles.petName}>{pet.name}</Text>
              <Text style={styles.petMood}>Mood: {pet.mood} • Lv.{pet.level}</Text>
              <View style={styles.petStats}>
                {[
                  { label: '🍖', value: pet.hunger },
                  { label: '😊', value: pet.happiness },
                  { label: '⚡', value: pet.energy },
                ].map(s => (
                  <View key={s.label} style={styles.petStatItem}>
                    <Text style={styles.petStatEmoji}>{s.label}</Text>
                    <View style={styles.miniBar}>
                      <View style={[styles.miniBarFill, { width: `${s.value}%` }]} />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* Active Goals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🎯 Active Goals</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Goals')}>
              <Text style={styles.seeAll}>See all →</Text>
            </TouchableOpacity>
          </View>

          {!active_goals?.length ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyEmoji}>🌟</Text>
              <Text style={styles.emptyText}>No active goals yet!</Text>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => navigation.navigate('Goals', { screen: 'CreateGoal' })}
              >
                <Text style={styles.btnText}>+ Create Goal</Text>
              </TouchableOpacity>
            </View>
          ) : (
            active_goals.map(goal => {
              const pct = calcProgress(goal.saved_amount, goal.target_amount)
              const dl = daysLeft(goal.deadline)
              return (
                <TouchableOpacity
                  key={goal.id}
                  style={styles.goalCard}
                  onPress={() => navigation.navigate('Goals', { screen: 'GoalDetail', params: { id: goal.id } })}
                >
                  <View style={styles.goalHeader}>
                    <View style={styles.goalTitleRow}>
                      <Text style={styles.goalCatEmoji}>{getCategoryEmoji(goal.category)}</Text>
                      <Text style={styles.goalTitle} numberOfLines={1}>{goal.title}</Text>
                    </View>
                    <Text style={[styles.pctBadge, { color: dl < 7 ? Colors.peach : Colors.primary }]}>
                      {pct}%
                    </Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, {
                      width: `${pct}%`,
                      backgroundColor: pct >= 100 ? Colors.mint : Colors.primary
                    }]} />
                  </View>
                  <View style={styles.goalFooter}>
                    <Text style={styles.goalSaved}>{formatRupiah(goal.saved_amount)}</Text>
                    <Text style={[styles.daysLeft, { color: dl < 7 ? Colors.peach : Colors.gray400 }]}>
                      {dl > 0 ? `${dl} days left` : 'Overdue'}
                    </Text>
                  </View>
                </TouchableOpacity>
              )
            })
          )}
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 32 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  loaderEmoji: { fontSize: 48, marginBottom: 12 },
  loaderText: { fontSize: 14, color: Colors.gray400, fontWeight: '600' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  greeting: { fontSize: 22, fontWeight: '800', color: Colors.gray800 },
  date: { fontSize: 12, color: Colors.gray400, marginTop: 2, fontWeight: '500' },
  streakBadge: {
    backgroundColor: Colors.lemonLight, borderRadius: Radius.lg,
    paddingHorizontal: 12, paddingVertical: 8, alignItems: 'center',
  },
  streakEmoji: { fontSize: 18 },
  streakNum: { fontSize: 16, fontWeight: '800', color: Colors.lemon },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  statCard: { flex: 1, borderRadius: Radius.lg, padding: 12, alignItems: 'center' },
  statEmoji: { fontSize: 20, marginBottom: 4 },
  statValue: { fontSize: 18, fontWeight: '800', color: Colors.gray800 },
  statLabel: { fontSize: 10, color: Colors.gray500, fontWeight: '700', marginTop: 2 },
  totalSaved: {
    backgroundColor: Colors.white, borderRadius: Radius.lg, padding: 16,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 12, ...Shadow.card,
  },
  totalLabel: { fontSize: 14, fontWeight: '700', color: Colors.gray500 },
  totalAmount: { fontSize: 18, fontWeight: '800', color: Colors.primary },
  petWidget: {
    backgroundColor: Colors.white, borderRadius: Radius.xl, padding: 16,
    flexDirection: 'row', gap: 12, marginBottom: 20, ...Shadow.card,
    borderWidth: 1, borderColor: Colors.primaryMid,
  },
  petLeft: { alignItems: 'center', justifyContent: 'center', width: 60 },
  petEmoji: { fontSize: 48 },
  petRight: { flex: 1 },
  petName: { fontSize: 16, fontWeight: '800', color: Colors.gray800, marginBottom: 2 },
  petMood: { fontSize: 11, color: Colors.gray400, fontWeight: '600', marginBottom: 8 },
  petStats: { gap: 4 },
  petStatItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  petStatEmoji: { fontSize: 12, width: 16 },
  miniBar: { flex: 1, height: 4, backgroundColor: Colors.gray100, borderRadius: 2, overflow: 'hidden' },
  miniBarFill: { height: 4, backgroundColor: Colors.primary, borderRadius: 2 },
  section: { marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.gray800 },
  seeAll: { fontSize: 13, color: Colors.primary, fontWeight: '700' },
  emptyCard: {
    backgroundColor: Colors.white, borderRadius: Radius.xl, padding: 24,
    alignItems: 'center', ...Shadow.card,
  },
  emptyEmoji: { fontSize: 40, marginBottom: 8 },
  emptyText: { fontSize: 14, color: Colors.gray400, fontWeight: '600', marginBottom: 16 },
  btn: { backgroundColor: Colors.primary, borderRadius: Radius.lg, paddingHorizontal: 20, paddingVertical: 10 },
  btnText: { color: Colors.white, fontWeight: '800', fontSize: 14 },
  goalCard: { backgroundColor: Colors.white, borderRadius: Radius.xl, padding: 16, marginBottom: 10, ...Shadow.card },
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  goalTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  goalCatEmoji: { fontSize: 20 },
  goalTitle: { fontSize: 15, fontWeight: '700', color: Colors.gray800, flex: 1 },
  pctBadge: { fontSize: 13, fontWeight: '800' },
  progressBar: { height: 8, backgroundColor: Colors.gray100, borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: 8, borderRadius: 4 },
  goalFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  goalSaved: { fontSize: 13, fontWeight: '700', color: Colors.primary },
  daysLeft: { fontSize: 12, fontWeight: '600' },
})
