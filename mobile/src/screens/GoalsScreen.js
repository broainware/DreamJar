import React, { useEffect, useState, useCallback } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  RefreshControl, Alert
} from 'react-native'
import api from '../utils/api'
import { formatRupiah, calcProgress, daysLeft, getCategoryEmoji } from '../utils/helpers'
import { Colors, Radius, Shadow } from '../utils/theme'

export default function GoalsScreen({ navigation }) {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState('active')

  const fetchGoals = async (status) => {
    try {
      const params = status !== 'all' ? { status } : {}
      const res = await api.get('/goals', { params })
      setGoals(res.data.goals)
    } catch {}
    finally { setLoading(false); setRefreshing(false) }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => fetchGoals(activeTab))
    return unsubscribe
  }, [navigation, activeTab])

  useEffect(() => { fetchGoals(activeTab) }, [activeTab])

  const onRefresh = useCallback(() => { setRefreshing(true); fetchGoals(activeTab) }, [activeTab])

  const handleDelete = (id) => {
    Alert.alert('Delete Goal', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/goals/${id}`)
            fetchGoals(activeTab)
          } catch { Alert.alert('Error', 'Failed to delete') }
        }
      }
    ])
  }

  const TABS = [
    { key: 'active', label: '🎯 Active' },
    { key: 'completed', label: '✅ Done' },
    { key: 'missed', label: '❌ Missed' },
  ]

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🎯 My Goals</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('CreateGoal')}
        >
          <Text style={styles.addBtnText}>+ New</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map(t => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tab, activeTab === t.key && styles.tabActive]}
            onPress={() => setActiveTab(t.key)}
          >
            <Text style={[styles.tabText, activeTab === t.key && styles.tabTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        contentContainerStyle={styles.list}
      >
        {goals.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🌟</Text>
            <Text style={styles.emptyText}>No {activeTab} goals</Text>
            {activeTab === 'active' && (
              <TouchableOpacity style={styles.createBtn} onPress={() => navigation.navigate('CreateGoal')}>
                <Text style={styles.createBtnText}>Create Your First Goal</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          goals.map(goal => {
            const pct = calcProgress(goal.saved_amount, goal.target_amount)
            const dl = daysLeft(goal.deadline)
            return (
              <TouchableOpacity
                key={goal.id}
                style={styles.goalCard}
                onPress={() => navigation.navigate('GoalDetail', { id: goal.id })}
                onLongPress={() => handleDelete(goal.id)}
              >
                <View style={styles.goalTop}>
                  <View style={styles.goalLeft}>
                    <Text style={styles.catEmoji}>{getCategoryEmoji(goal.category)}</Text>
                    <Text style={styles.goalTitle} numberOfLines={1}>{goal.title}</Text>
                  </View>
                  <Text style={styles.pct}>{pct}%</Text>
                </View>

                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, {
                    width: `${pct}%`,
                    backgroundColor: pct >= 100 ? Colors.mint : Colors.primary
                  }]} />
                </View>

                <View style={styles.goalBottom}>
                  <Text style={styles.savedAmount}>{formatRupiah(goal.saved_amount)}</Text>
                  <Text style={styles.targetAmount}>of {formatRupiah(goal.target_amount)}</Text>
                  <View style={{ flex: 1 }} />
                  <Text style={[styles.daysLeft, dl < 7 ? { color: Colors.peach } : {}]}>
                    {dl > 0 ? `${dl}d left` : 'Overdue'}
                  </Text>
                </View>

                {goal.motivation_note ? (
                  <Text style={styles.motivationNote} numberOfLines={1}>
                    💭 {goal.motivation_note}
                  </Text>
                ) : null}
              </TouchableOpacity>
            )
          })
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8,
  },
  title: { fontSize: 24, fontWeight: '800', color: Colors.gray800 },
  addBtn: { backgroundColor: Colors.primary, borderRadius: Radius.lg, paddingHorizontal: 16, paddingVertical: 8 },
  addBtnText: { color: Colors.white, fontWeight: '800', fontSize: 14 },
  tabs: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 12 },
  tab: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: Radius.lg, backgroundColor: Colors.white },
  tabActive: { backgroundColor: Colors.primary },
  tabText: { fontSize: 12, fontWeight: '700', color: Colors.gray500 },
  tabTextActive: { color: Colors.white },
  list: { padding: 16, paddingTop: 0 },
  empty: { alignItems: 'center', paddingVertical: 48 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 15, color: Colors.gray400, fontWeight: '600', marginBottom: 20 },
  createBtn: { backgroundColor: Colors.primary, borderRadius: Radius.lg, paddingHorizontal: 24, paddingVertical: 12 },
  createBtnText: { color: Colors.white, fontWeight: '800' },
  goalCard: { backgroundColor: Colors.white, borderRadius: Radius.xl, padding: 16, marginBottom: 12, ...Shadow.card },
  goalTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  goalLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  catEmoji: { fontSize: 22 },
  goalTitle: { fontSize: 15, fontWeight: '700', color: Colors.gray800, flex: 1 },
  pct: { fontSize: 14, fontWeight: '800', color: Colors.primary },
  progressBar: { height: 8, backgroundColor: Colors.gray100, borderRadius: 4, overflow: 'hidden', marginBottom: 10 },
  progressFill: { height: 8, borderRadius: 4 },
  goalBottom: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  savedAmount: { fontSize: 13, fontWeight: '800', color: Colors.primary },
  targetAmount: { fontSize: 11, color: Colors.gray400, fontWeight: '500' },
  daysLeft: { fontSize: 12, fontWeight: '700', color: Colors.gray400 },
  motivationNote: { fontSize: 11, color: Colors.gray400, fontStyle: 'italic', marginTop: 8 },
})
