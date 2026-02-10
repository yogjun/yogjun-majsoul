import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface StatData {
  totalGames: number
  winRate: number
  avgScore: number
  totalPlayers: number
  activePlayers: number
  peakOnline: number
  totalRevenue: number
  avgGameDuration: number
  peakConcurrentGames: number
}

export const useDashboardStore = defineStore('dashboard', () => {
  const statData = ref<StatData>({
    totalGames: 0,
    winRate: 0,
    avgScore: 0,
    totalPlayers: 0,
    activePlayers: 0,
    peakOnline: 0,
    totalRevenue: 0,
    avgGameDuration: 0,
    peakConcurrentGames: 0
  })

  const generateMockData = (): StatData => {
    return {
      totalGames: Math.floor(Math.random() * 5000) + 2000,
      winRate: Math.random() * 40 + 20,
      avgScore: Math.floor(Math.random() * 800) + 200,
      totalPlayers: Math.floor(Math.random() * 80000) + 20000,
      activePlayers: Math.floor(Math.random() * 3000) + 500,
      peakOnline: Math.floor(Math.random() * 15000) + 3000,
      totalRevenue: Math.floor(Math.random() * 500000) + 100000,
      avgGameDuration: Math.floor(Math.random() * 30) + 10,
      peakConcurrentGames: Math.floor(Math.random() * 2000) + 500
    }
  }

  const initData = () => {
    statData.value = generateMockData()
  }

  const updateData = () => {
    statData.value = generateMockData()
  }

  return {
    statData,
    generateMockData,
    initData,
    updateData
  }
})