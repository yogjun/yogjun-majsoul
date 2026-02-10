import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface StatData {
  totalGames: number
  winRate: number
  avgScore: number
  totalPlayers: number
  activePlayers: number
  peakOnline: number
}

export const useDashboardStore = defineStore('dashboard', () => {
  const statData = ref<StatData>({
    totalGames: 0,
    winRate: 0,
    avgScore: 0,
    totalPlayers: 0,
    activePlayers: 0,
    peakOnline: 0
  })

  const generateMockData = (): StatData => {
    return {
      totalGames: Math.floor(Math.random() * 10000) + 1000,
      winRate: Math.random() * 100,
      avgScore: Math.floor(Math.random() * 1000) + 100,
      totalPlayers: Math.floor(Math.random() * 100000) + 10000,
      activePlayers: Math.floor(Math.random() * 5000) + 1000,
      peakOnline: Math.floor(Math.random() * 20000) + 5000
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